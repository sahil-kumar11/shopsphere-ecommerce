from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="first_name")
    email = serializers.EmailField()
    memberSince = serializers.SerializerMethodField()
    phone = serializers.CharField(required=False, allow_blank=True)

    def get_memberSince(self, obj):
        return obj.date_joined.strftime("%b %Y")


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, min_length=2, trim_whitespace=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_password(self, value):
        validate_password(value)
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProductSerializer(serializers.ModelSerializer):
    oldPrice = serializers.DecimalField(
        source="old_price", max_digits=10, decimal_places=2,
        allow_null=True, read_only=True, coerce_to_string=False,
    )
    isSale = serializers.BooleanField(source="is_sale", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "category", "gender", "price", "oldPrice", "image",
            "badge", "sizes", "colours", "description", "isSale", "created_at", "updated_at",
        ]
        extra_kwargs = {"price": {"coerce_to_string": False}}


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    selectedSize = serializers.CharField(source="selected_size", read_only=True)
    selectedColour = serializers.CharField(source="selected_colour", read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True, coerce_to_string=False,
    )

    class Meta:
        model = CartItem
        fields = [
            "id", "product", "quantity", "selectedSize", "selectedColour",
            "subtotal", "created_at", "updated_at",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    totalItems = serializers.IntegerField(source="total_items", read_only=True)
    totalPrice = serializers.DecimalField(
        source="total_price", max_digits=12, decimal_places=2,
        read_only=True, coerce_to_string=False,
    )

    class Meta:
        model = Cart
        fields = ["id", "items", "totalItems", "totalPrice", "created_at", "updated_at"]


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "product", "created_at"]


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    totalItems = serializers.IntegerField(source="total_items", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "items", "totalItems", "created_at", "updated_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.IntegerField(source="product_id", read_only=True, allow_null=True)
    productName = serializers.CharField(source="product_name", read_only=True)
    productImage = serializers.CharField(source="product_image", read_only=True)
    selectedSize = serializers.CharField(source="selected_size", read_only=True, allow_null=True)
    selectedColour = serializers.CharField(source="selected_colour", read_only=True, allow_null=True)

    class Meta:
        model = OrderItem
        fields = [
            "id", "productId", "productName", "productImage", "price", "quantity",
            "selectedSize", "selectedColour", "subtotal", "created_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    totalItems = serializers.IntegerField(source="total_items", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "status", "full_name", "email", "phone", "address", "city", "postal_code",
            "country", "payment_method", "subtotal", "shipping_fee", "tax", "total", "totalItems",
            "items", "created_at", "updated_at",
        ]


class OrderCreateItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)
    selectedSize = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    selectedColour = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, min_length=7)
    address = serializers.CharField(max_length=500, trim_whitespace=True)
    city = serializers.CharField(max_length=100, trim_whitespace=True)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, default="Pakistan")
    payment_method = serializers.ChoiceField(choices=["card", "wallet", "cod"], default="cod")
    items = OrderCreateItemSerializer(many=True, allow_empty=False)
