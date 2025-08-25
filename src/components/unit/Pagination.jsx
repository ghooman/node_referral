import './Pagination.scss';

function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  // 아이템 20개 미만인 경우, 페이지네이션 미 노출
  if (totalItems < 20 || totalPages <= 1) return null;

  const pageNumbers = [];

  // 최대 5페이지까지만 표시
  const visiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

 // 페이지 변경 시 최상단 스크롤
  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
