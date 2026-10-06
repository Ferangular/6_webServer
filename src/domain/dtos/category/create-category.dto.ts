export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ) {}

    static create(object: Record<string, unknown>): [string | undefined, CreateCategoryDto | undefined] {
        const { name, available = true } = object;
        if (typeof name !== 'string' || name.trim().length === 0) return ['Missing name', undefined];
        if (typeof available !== 'boolean') return ['Available must be a boolean', undefined];
        return [undefined, new CreateCategoryDto(name.trim().toLowerCase(), available)];
    }
}