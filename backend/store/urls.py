from django.urls import path

from .views import (
    AuthAPIView,
    CurrentUserAPIView,
    ProductListAPIView,
    ProductDetailAPIView,
    CartAPIView,
    CartItemAPIView,
    CartItemDetailAPIView,
    WishlistAPIView,
    WishlistItemAPIView,
    WishlistItemDetailAPIView,
    OrderListCreateAPIView,
    OrderDetailAPIView,
)


urlpatterns = [
    # =========================
    # Authentication
    # =========================

    # IMPORTANT:
    # Keep this BEFORE auth/<str:action>/
    path(
        "auth/me/",
        CurrentUserAPIView.as_view(),
        name="current-user",
    ),

    path(
        "auth/<str:action>/",
        AuthAPIView.as_view(),
        name="auth-action",
    ),

    # =========================
    # Products
    # =========================

    path(
        "products/",
        ProductListAPIView.as_view(),
        name="product-list",
    ),

    path(
        "products/<int:pk>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),

    # =========================
    # Cart
    # =========================

    path(
        "cart/",
        CartAPIView.as_view(),
        name="cart",
    ),

    path(
        "cart/items/",
        CartItemAPIView.as_view(),
        name="cart-items",
    ),

    path(
        "cart/items/<int:item_id>/",
        CartItemDetailAPIView.as_view(),
        name="cart-item-detail",
    ),

    # =========================
    # Wishlist
    # =========================

    path(
        "wishlist/",
        WishlistAPIView.as_view(),
        name="wishlist",
    ),

    path(
        "wishlist/items/",
        WishlistItemAPIView.as_view(),
        name="wishlist-items",
    ),

    path(
        "wishlist/items/<int:product_id>/",
        WishlistItemDetailAPIView.as_view(),
        name="wishlist-item-detail",
    ),

    # =========================
    # Orders
    # =========================

    path(
        "orders/",
        OrderListCreateAPIView.as_view(),
        name="order-list-create",
    ),

    path(
        "orders/<int:order_id>/",
        OrderDetailAPIView.as_view(),
        name="order-detail",
    ),
]
