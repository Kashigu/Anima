import { useState, useEffect } from 'react';

function usePagination<T>(items: T[], itemsPerPage: number, resetPage: boolean) {
    const [currentPage, setCurrentPage] = useState(1);

    // Effect to reset the current page when resetPage changes or items change
    useEffect(() => {
        if (resetPage) {
            setCurrentPage(1);
        }
    }, [resetPage, items]);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const displayedItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return { currentPage, totalPages, displayedItems, goToNextPage, goToPreviousPage };
}

export default usePagination;
