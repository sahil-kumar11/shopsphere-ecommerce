from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0005_order_orderitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="cartitem",
            name="selected_colour",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="cartitem",
            name="selected_size",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.RemoveConstraint(
            model_name="cartitem",
            name="unique_cart_product",
        ),
        migrations.AddConstraint(
            model_name="cartitem",
            constraint=models.UniqueConstraint(
                fields=("cart", "product", "selected_size", "selected_colour"),
                name="unique_cart_product_variant",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_method",
            field=models.CharField(
                choices=[
                    ("card", "Credit / Debit Card"),
                    ("wallet", "Digital Wallet"),
                    ("cod", "Cash on Delivery"),
                ],
                default="cod",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="tax",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
