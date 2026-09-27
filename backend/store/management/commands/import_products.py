import ast
import re
from pathlib import Path

from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    help = "Import products from React products.js"

    def handle(self, *args, **options):

        backend_directory = Path(__file__).resolve().parents[3]
        project_directory = backend_directory.parent

        products_file = (
            project_directory
            / "src"
            / "data"
            / "products.js"
        )

        if not products_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"products.js not found:\n{products_file}"
                )
            )
            return

        self.stdout.write(
            f"Reading products from:\n{products_file}\n"
        )

        content = products_file.read_text(
            encoding="utf-8"
        )

        # Extract only the products array
        match = re.search(
            r"const\s+products\s*=\s*\[(.*?)\]\s*;",
            content,
            re.DOTALL,
        )

        if not match:
            self.stdout.write(
                self.style.ERROR(
                    "Could not find products array."
                )
            )
            return

        products_content = match.group(1)

        # Find individual product objects
        objects = re.findall(
            r"\{(.*?)\}",
            products_content,
            re.DOTALL,
        )

        products = []

        for obj in objects:

            product = {}

            # id
            match_id = re.search(
                r"\bid\s*:\s*(\d+)",
                obj
            )

            if match_id:
                product["id"] = int(match_id.group(1))

            # String fields
            fields = [
                "name",
                "category",
                "gender",
                "badge",
                "description",
            ]

            for field in fields:

                match_field = re.search(
                    rf"{field}\s*:\s*(['\"])(.*?)\1",
                    obj,
                    re.DOTALL,
                )

                if match_field:
                    product[field] = match_field.group(2)

            # Price
            match_price = re.search(
                r"\bprice\s*:\s*(\d+(?:\.\d+)?)",
                obj
            )

            if match_price:
                product["price"] = match_price.group(1)

            # Old price
            match_old_price = re.search(
                r"\boldPrice\s*:\s*(null|\d+(?:\.\d+)?)",
                obj
            )

            if match_old_price:

                value = match_old_price.group(1)

                if value == "null":
                    product["oldPrice"] = None
                else:
                    product["oldPrice"] = value

            # Image
            match_image = re.search(
                r"\bimage\s*:\s*(?:\r?\n\s*)?(['\"])(.*?)\1",
                obj,
                re.DOTALL,
            )

            if match_image:

                image = match_image.group(2)

                # Convert markdown image URL to normal URL
                markdown_match = re.search(
                    r"\((https?://[^)]+)\)",
                    image,
                )

                if markdown_match:
                    image = markdown_match.group(1)

                # Remove escaped characters
                image = image.replace("\\&", "&")

                product["image"] = image

            # Sizes
            match_sizes = re.search(
                r"\bsizes\s*:\s*\[(.*?)\]",
                obj,
                re.DOTALL,
            )

            if match_sizes:

                values = re.findall(
                    r"['\"](.*?)['\"]",
                    match_sizes.group(1),
                )

                product["sizes"] = values

            else:
                product["sizes"] = []

            # Colours
            match_colours = re.search(
                r"\bcolours\s*:\s*\[(.*?)\]",
                obj,
                re.DOTALL,
            )

            if match_colours:

                values = re.findall(
                    r"['\"](.*?)['\"]",
                    match_colours.group(1),
                )

                product["colours"] = values

            else:
                product["colours"] = []

            if "id" in product:
                products.append(product)

        self.stdout.write(
            f"Found {len(products)} products.\n"
        )

        created_count = 0
        updated_count = 0

        for product_data in products:

            product, created = Product.objects.update_or_create(
                id=product_data["id"],
                defaults={
                    "name": product_data.get(
                        "name",
                        ""
                    ),
                    "category": product_data.get(
                        "category",
                        ""
                    ),
                    "gender": product_data.get(
                        "gender",
                        ""
                    ),
                    "price": product_data.get(
                        "price",
                        0
                    ),
                    "old_price": product_data.get(
                        "oldPrice"
                    ),
                    "image": product_data.get(
                        "image",
                        ""
                    ),
                    "badge": product_data.get(
                        "badge"
                    ),
                    "sizes": product_data.get(
                        "sizes",
                        []
                    ),
                    "colours": product_data.get(
                        "colours",
                        []
                    ),
                    "description": product_data.get(
                        "description",
                        ""
                    ),
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                "\nProduct import completed successfully!"
            )
        )

        self.stdout.write(
            f"Created: {created_count}"
        )

        self.stdout.write(
            f"Updated: {updated_count}"
        )

        self.stdout.write(
            f"Total in database: {Product.objects.count()}"
        )