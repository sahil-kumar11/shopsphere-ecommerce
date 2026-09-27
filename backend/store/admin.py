from django.contrib import admin

from .models import (
    Product,
    Cart,
    CartItem,
    Wishlist,
    WishlistItem,
    Order,
    OrderItem,
)


# ============================================================
# PRODUCT ADMIN
# ============================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "gender",
        "price",
        "old_price",
        "is_sale",
        "badge",
        "created_at",
    )

    list_filter = (
        "category",
        "gender",
        "badge",
    )

    search_fields = (
        "name",
        "category",
        "gender",
        "description",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


# ============================================================
# CART ADMIN
# ============================================================

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "total_items",
        "total_price",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# CART ITEM ADMIN
# ============================================================

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "cart",
        "product",
        "quantity",
        "subtotal",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "product__name",
        "cart__user__username",
        "cart__user__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# WISHLIST ADMIN
# ============================================================

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "total_items",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# WISHLIST ITEM ADMIN
# ============================================================

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "wishlist",
        "product",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "product__name",
        "wishlist__user__username",
        "wishlist__user__email",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )


# ============================================================
# ORDER ADMIN
# ============================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "full_name",
        "status",
        "subtotal",
        "shipping_fee",
        "total",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "full_name",
        "email",
        "phone",
        "city",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    list_editable = (
        "status",
    )


# ============================================================
# ORDER ITEM ADMIN
# ============================================================

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "product_name",
        "price",
        "quantity",
        "subtotal",
        "selected_size",
        "selected_colour",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "product_name",
        "order__user__username",
        "order__user__email",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )