import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">

      <button
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="pagination-pages">

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            className={`pagination-number ${
              currentPage === page
                ? "active"
                : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

      </div>

      <button
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>

    </nav>
  );
}

export default Pagination;