import { ChevronRight } from "lucide-react";
import "./ShopHeader.css";

function ShopHeader() {
  return (
    <div className="shop-header">

      <div className="breadcrumb">
        <span>Home</span>

        <ChevronRight size={12} />

        <span className="breadcrumb-current">
          Shop
        </span>
      </div>

      <h1>Shop</h1>

      <p className="product-count">
        128 products found
      </p>

    </div>
  );
}

export default ShopHeader;