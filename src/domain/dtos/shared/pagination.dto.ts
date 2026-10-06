export class PaginationDto {
    private constructor(
        public readonly page: number,
        public readonly limit: number,
    ) {}

    static create(page: unknown = 1, limit: unknown = 10): [string | undefined, PaginationDto | undefined] {
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedPage) || !Number.isInteger(parsedLimit)) return ['Page and limit must be integers', undefined];
        if (parsedPage <= 0) return ['Page must be greater than 0', undefined];
        if (parsedLimit <= 0 || parsedLimit > 100) return ['Limit must be between 1 and 100', undefined];
        return [undefined, new PaginationDto(parsedPage, parsedLimit)];
    }
}