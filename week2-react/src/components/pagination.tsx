function Pagination() {
  return (
    <div className="pagination">
      <button type="button" aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      <button type="button" className="current-page">
        1
      </button>

      <button type="button" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </div>
  );
}

export default Pagination;
