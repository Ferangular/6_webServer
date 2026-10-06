import { CategoryModel } from '../../data/index.js';
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain/index.js';

export class CategoryService {
    async createCategory(dto: CreateCategoryDto, user: UserEntity) {
        const existingCategory = await CategoryModel.findOne({ name: dto.name });
        if (existingCategory) throw CustomError.badRequest('Category already exists');

        try {
            const category = await CategoryModel.create({ ...dto, user: user.id });
            return { id: category.id, name: category.name, available: category.available };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer('Unable to create category');
        }
    }

    async getCategories(dto: PaginationDto) {
        const { page, limit } = dto;
        const [total, categories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find().sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
        ]);
        const pages = Math.ceil(total / limit);
        return {
            page,
            limit,
            total,
            pages,
            next: page < pages ? `/api/categories?page=${page + 1}&limit=${limit}` : null,
            prev: page > 1 ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
            categories: categories.map(({ id, name, available }) => ({ id, name, available })),
        };
    }
}