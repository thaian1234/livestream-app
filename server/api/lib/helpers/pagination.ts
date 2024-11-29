interface PaginationMetadata {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    pageSize: number;
}

interface PaginationInput<T> {
    data: T;
    totalRecords?: number;
    currentOffset: number;
    limit: number;
}

export default class PaginationHelper {
    public static getPaginationMetadata<T>({
        data,
        totalRecords = 0,
        currentOffset,
        limit,
    }: PaginationInput<T>) {
        const currentPage = Math.floor(currentOffset / limit) + 1;
        const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        return {
            data,
            pagination: {
                totalRecords,
                currentPage,
                totalPages,
                nextPage: hasNextPage ? currentPage + 1 : null,
                prevPage: hasPrevPage ? currentPage - 1 : null,
                hasNextPage,
                hasPrevPage,
                isFirstPage: currentPage === 1,
                isLastPage: currentPage === totalPages,
                pageSize: limit,
            },
        };
    }
}
