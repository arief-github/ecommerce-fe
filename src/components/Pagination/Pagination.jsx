export const Pagination = (props) => {
    const {
        totalPages,
        currentPage,
        onPageChange,
    } = props;

    const pageNumbers = Array.from(
        {length: totalPages},
        (_, index) => index + 1
    );

    return (
        <nav>
            <ul className="pagination">
                {
                    pageNumbers.map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                                disabled={currentPage === page}
                                onClick={() => onPageChange(page)}
                                className="page-link">
                                {page}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}

export default Pagination;