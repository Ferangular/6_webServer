import { isValidObjectId } from 'mongoose';

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string | undefined,
        public readonly user: string,
        public readonly category: string,
    ) {}

    static create(object: Record<string, unknown>): [string | undefined, CreateProductDto | undefined] {
        const { name, available = true, price = 0, description, user, category } = object;
        if (typeof name !== 'string' || name.trim().length === 0) return ['Missing name', undefined];
        if (typeof available !== 'boolean') return ['Available must be a boolean', undefined];
        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) return ['Price must be a non-negative number', undefined];
        if (description !== undefined && typeof description !== 'string') return ['Description must be a string', undefined];
        if (typeof user !== 'string' || !isValidObjectId(user)) return ['Invalid user ID', undefined];
        if (typeof category !== 'string' || !isValidObjectId(category)) return ['Invalid category ID', undefined];
        return [undefined, new CreateProductDto(name.trim(), available, parsedPrice, description?.trim(), user, category)];
    }
}