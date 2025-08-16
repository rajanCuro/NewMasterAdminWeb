import React from "react";

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
        <div className="mt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                    {Math.min(indexOfLastItem, totalItems)}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(
                            Math.max(0, currentPage - 3),
                            Math.min(totalPages, currentPage + 2)
                        )
                        .map((page) => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                </div>

                {/* Next */}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Pagination;
