import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./MembershipBanner.css";

function MembershipBanner() {
  return (
    <section className="membership-section">
      <div className="membership-banner">

        <div className="membership-content">
          <p className="membership-label">
            SHOPSPHERE CIRCLE
          </p>

          <h2>
            Join the ShopSphere Circle.
          </h2>

          <p className="membership-description">
            Get early access to new drops, member-only
            pricing, and free express shipping.
          </p>
        </div>

        <Link to="/auth?mode=signup" className="membership-button">
          Become a Member
          <ArrowRight size={15} />
        </Link>

      </div>
    </section>
  );
}

export default MembershipBanner;