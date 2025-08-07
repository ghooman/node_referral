import './Pagination.scss';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  // 최대 5페이지까지만 표시
  const visiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <span
        className="pagination__arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </span>

      {pageNumbers.map(number => (
        <button
          key={number}
          className={`pagination__number ${number === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <span
        className="pagination__arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </span>
    </div>
  );
}

export default Pagination;
