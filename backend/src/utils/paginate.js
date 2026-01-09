export function getPagination(query, defaults = { page: 1, limit: 10, maxLimit: 100 }) {
    const page = Math.max(parseInt(query.page, 10) || defaults.page, 1);
    const limit = Math.min(
        Math.max(parseInt(query.limit, 10) || defaults.limit, 1),
        defaults.maxLimit
    )
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

export function buildPaginationMeta({ total, page, limit }) {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}