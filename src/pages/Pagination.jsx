import React, { useState, useEffect } from "react";
import { FcPrevious } from "react-icons/fc";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) {
    const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);
    const totalPages = Math.ceil(totalItems / localItemsPerPage);

    // Sync local state with props
    useEffect(() => {
        setLocalItemsPerPage(itemsPerPage);
    }, [itemsPerPage]);

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = Number(e.target.value);
        setLocalItemsPerPage(newItemsPerPage);
        if (onItemsPerPageChange) {
            onItemsPerPageChange(newItemsPerPage);
        }
        // Reset to first page when changing items per page
        onPageChange(1);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const indexOfLastItem = currentPage * localItemsPerPage;
    const indexOfFirstItem = indexOfLastItem - localItemsPerPage;

    // Generate visible page numbers with ellipsis for large ranges
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Show ellipsis or pages around current page
            if (currentPage > 3) {
                pages.push('...');
            }

            // Show current page and neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }

            // Show ellipsis or last pages
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="mt-1 pb-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex justify-start items-center gap-4">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Items Per Page:</label>
                <select
                    value={localItemsPerPage}
                    onChange={handleItemsPerPageChange}
                    name="itemsPerPage"
                    id="itemsPerPage"
                    className="border border-gray-300 cursor-pointer rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>

            <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">{totalItems === 0 ? 0 : indexOfFirstItem + 1}</span> to{" "}
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
                    className={`w-8 h-8 cursor-pointer flex items-center justify-center rounded-full transition-colors duration-200 
                        ${currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <MdOutlineNavigateBefore  size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-8 h-8 flex items-center justify-center text-gray-500"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-200
                                     ${currentPage === page
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-full transition-colors duration-200
                         ${currentPage === totalPages || totalPages === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <MdOutlineNavigateNext size={18} />
                </button>
            </div>

        </div>
    );
}

export default Pagination;