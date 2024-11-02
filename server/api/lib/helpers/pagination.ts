interface PaginationHelperType<T> {
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
    }: PaginationHelperType<T>) {
        const currentPage = Math.floor(currentOffset / limit) + 1;
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data,
            pagination: {
                totalRecords: totalRecords,
                currentPage: currentPage,
                totalPages: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : null,
                prevPage: currentPage > 1 ? currentPage - 1 : null,
            },
        };
    }
}
