type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onNext, onPrevious }) => {
    return (
        <div className="pagination-controls flex items-center justify-between w-full px-4 mt-4">
            <button
                onClick={onPrevious}
                disabled={currentPage === 1}
                className="disabled:opacity-50 custom-button bg-black text-white rounded p-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <span className="text-center text-white text-2xl ">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 custom-button bg-black text-white rounded p-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default PaginationControls;
