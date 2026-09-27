from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import Product, CartItem, Order


class ShopSphereAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="TestPass123!",
            first_name="Test User",
        )
        self.token = Token.objects.create(user=self.user)
        self.product = Product.objects.create(
            name="Test Shirt",
            category="Men",
            gender="Men",
            price=Decimal("3000.00"),
            image="https://example.com/test.jpg",
            sizes=["M", "L"],
            colours=["Black", "White"],
        )

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_register(self):
        response = self.client.post("/api/auth/register/", {
            "name": "New User",
            "email": "new@example.com",
            "password": "NewPass123!",
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)

    def test_login(self):
        response = self.client.post("/api/auth/login/", {
            "email": "test@example.com",
            "password": "TestPass123!",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)

    def test_cart_preserves_variants(self):
        self.authenticate()
        response = self.client.post("/api/cart/items/", {
            "product_id": self.product.id,
            "quantity": 2,
            "selected_size": "M",
            "selected_colour": "Black",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        item = CartItem.objects.get()
        self.assertEqual(item.selected_size, "M")
        self.assertEqual(item.selected_colour, "Black")
        self.assertEqual(item.quantity, 2)

    def test_order_total_is_calculated_server_side(self):
        self.authenticate()
        response = self.client.post("/api/orders/", {
            "full_name": "Test User",
            "email": "test@example.com",
            "phone": "+923001234567",
            "address": "123 Main Street",
            "city": "Karachi",
            "postal_code": "75500",
            "country": "Pakistan",
            "payment_method": "cod",
            "items": [{
                "id": self.product.id,
                "quantity": 2,
                "selectedSize": "M",
                "selectedColour": "Black",
            }],
        }, format="json")
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.subtotal, Decimal("6000.00"))
        self.assertEqual(order.shipping_fee, Decimal("0.00"))
        self.assertEqual(order.tax, Decimal("413.00"))
        self.assertEqual(order.total, Decimal("6413.00"))

    def test_user_only_sees_own_orders(self):
        self.authenticate()
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
