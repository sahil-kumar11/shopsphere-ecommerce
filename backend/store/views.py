from decimal import Decimal, ROUND_HALF_UP

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from .models import Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem
from .serializers import (
    ProductSerializer, CartSerializer, WishlistSerializer, OrderSerializer,
    OrderCreateSerializer, RegisterSerializer, LoginSerializer, UserSerializer,
)


class AuthAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

    def post(self, request, action):
        if action == "register":
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            email = data["email"].strip().lower()

            if get_user_model().objects.filter(email__iexact=email).exists():
                return Response(
                    {"detail": "This email is already registered."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            User = get_user_model()
            user = User.objects.create_user(
                username=email,
                email=email,
                password=data["password"],
                first_name=data["name"].strip(),
            )
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"access": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        user = authenticate(username=email, password=serializer.validated_data["password"])

        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"access": token.key, "user": UserSerializer(user).data})


class CurrentUserAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the currently authenticated user.
        Used by the frontend Account page after login/register.
        """
        return Response(
            UserSerializer(request.user).data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        """
        Update the currently authenticated user's profile.
        """
        user = request.user

        name = request.data.get("name")
        email = request.data.get("email")

        if name is not None:
            name = str(name).strip()

            if len(name) < 2:
                return Response(
                    {"detail": "Name must be at least 2 characters."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.first_name = name

        if email is not None:
            email = str(email).strip().lower()

            if not email:
                return Response(
                    {"detail": "Email is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            User = get_user_model()

            if (
                User.objects
                .exclude(pk=user.pk)
                .filter(email__iexact=email)
                .exists()
            ):
                return Response(
                    {"detail": "This email is already registered."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.email = email
            user.username = email

        user.save()

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK,
        )

class ProductListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all().order_by("-created_at")
        return Response(ProductSerializer(products, many=True).data)


class ProductDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        return Response(ProductSerializer(product).data)


def get_cart(user):
    cart, _ = Cart.objects.prefetch_related("items__product").get_or_create(user=user)
    return cart


class CartAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(CartSerializer(get_cart(request.user)).data)

    def delete(self, request):
        cart = get_cart(request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)


class CartItemAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response({"detail": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        selected_size = request.data.get("selected_size") or ""
        selected_colour = request.data.get("selected_colour") or ""

        if selected_size and selected_size not in (product.sizes or []):
            return Response({"detail": "Selected size is not available for this product."}, status=status.HTTP_400_BAD_REQUEST)
        if selected_colour and selected_colour not in (product.colours or []):
            return Response({"detail": "Selected colour is not available for this product."}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_cart(request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            selected_size=selected_size,
            selected_colour=selected_colour,
            defaults={"quantity": quantity},
        )
        if not created:
            item.quantity += quantity
            item.save()

        cart.save(update_fields=["updated_at"])
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        cart = get_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        try:
            quantity = int(request.data.get("quantity"))
        except (TypeError, ValueError):
            return Response({"detail": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save()
        cart.save(update_fields=["updated_at"])
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        cart.save(update_fields=["updated_at"])
        return Response(CartSerializer(cart).data)


def get_wishlist(user):
    wishlist, _ = Wishlist.objects.prefetch_related("items__product").get_or_create(user=user)
    return wishlist


class WishlistAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(WishlistSerializer(get_wishlist(request.user)).data)

    def delete(self, request):
        wishlist = get_wishlist(request.user)
        wishlist.items.all().delete()
        return Response(WishlistSerializer(wishlist).data)


class WishlistItemAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, id=product_id)
        wishlist = get_wishlist(request.user)
        WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)
        return Response(WishlistSerializer(wishlist).data)


class WishlistItemDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        wishlist = get_wishlist(request.user)
        item = get_object_or_404(WishlistItem, wishlist=wishlist, product_id=product_id)
        item.delete()
        return Response(WishlistSerializer(wishlist).data)


TAX_RATE = Decimal("0.0688")
FREE_SHIPPING_THRESHOLD = Decimal("5000.00")
STANDARD_SHIPPING = Decimal("250.00")


def calculate_tax(subtotal):
    return (subtotal * TAX_RATE).quantize(Decimal("1"), rounding=ROUND_HALF_UP)


def calculate_shipping(subtotal):
    return Decimal("0.00") if subtotal == 0 or subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING


class OrderListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects.filter(user=request.user)
            .prefetch_related("items")
        )
        return Response(OrderSerializer(orders, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        subtotal = Decimal("0.00")
        validated_items = []

        for item_data in data["items"]:
            product = get_object_or_404(Product, id=item_data["id"])
            quantity = item_data["quantity"]
            selected_size = item_data.get("selectedSize") or None
            selected_colour = item_data.get("selectedColour") or None

            if selected_size and selected_size not in (product.sizes or []):
                return Response({"detail": f"Selected size is unavailable for {product.name}."}, status=status.HTTP_400_BAD_REQUEST)
            if selected_colour and selected_colour not in (product.colours or []):
                return Response({"detail": f"Selected colour is unavailable for {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

            subtotal += product.price * quantity
            validated_items.append((product, quantity, selected_size, selected_colour))

        shipping = calculate_shipping(subtotal)
        tax = calculate_tax(subtotal)
        total = subtotal + shipping + tax

        order = Order.objects.create(
            user=request.user,
            full_name=data["full_name"],
            email=data["email"],
            phone=data["phone"],
            address=data["address"],
            city=data["city"],
            postal_code=data.get("postal_code", ""),
            country=data.get("country", "Pakistan"),
            payment_method=data["payment_method"],
            subtotal=subtotal,
            shipping_fee=shipping,
            tax=tax,
            total=total,
            status=Order.STATUS_PENDING,
        )

        for product, quantity, selected_size, selected_colour in validated_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=product.image,
                price=product.price,
                quantity=quantity,
                selected_size=selected_size,
                selected_colour=selected_colour,
            )

        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()
            cart.save(update_fields=["updated_at"])

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_order(self, request, order_id):
        return get_object_or_404(Order.objects.prefetch_related("items"), id=order_id, user=request.user)

    def get(self, request, order_id):
        return Response(OrderSerializer(self.get_order(request, order_id)).data)

    def patch(self, request, order_id):
        order = self.get_order(request, order_id)

        requested_status = str(request.data.get("status", "")).lower()
        if requested_status != Order.STATUS_CANCELLED:
            return Response(
                {"detail": "Only order cancellation is allowed from this endpoint."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cancellable_statuses = {
            Order.STATUS_PENDING,
            Order.STATUS_CONFIRMED,
        }
        if order.status not in cancellable_statuses:
            return Response(
                {"detail": "This order can no longer be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = Order.STATUS_CANCELLED
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)
