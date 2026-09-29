export default function Pagination() {
    return (
        <nav className="pagination">
            <button type="button" aria-label="이전 페이지">
                <img src="/icons/chevron-left.svg" alt=""/>
            </button>

            <button type="button" className="active-page">
                1
            </button>

            <button type="button" aria-label="다음 페이지">
                <img src="/icons/chevron-right.svg" alt=""/>
            </button>
        </nav>
    );
}
