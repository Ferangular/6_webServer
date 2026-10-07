import { CategoryModel, ProductModel } from '../../data/index.js';
import { CreateProductDto, CustomError, PaginationDto } from '../../domain/index.js';

export class ProductService {
    async createProduct(dto: CreateProductDto) {
        const [existingProduct, category] = await Promise.all([
            ProductModel.findOne({ name: dto.name }),
            CategoryModel.findById(dto.category),
        ]);
        if (existingProduct) throw CustomError.badRequest('Product already exists');
        if (!category) throw CustomError.notFound('Category does not exist');
        if (!category.available) throw CustomError.badRequest('Category is not available');

        try {
            const product = await ProductModel.create(dto);
            return product.populate([
                { path: 'user', select: 'name email' },
                { path: 'category', select: 'name available' },
            ]);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer('Unable to create product');
        }
    }

    async getProducts(dto: PaginationDto) {
        const { page, limit } = dto;
        const filter = { available: true };
        const [total, products] = await Promise.all([
            ProductModel.countDocuments(filter),
            ProductModel.find(filter)
                .sort({ name: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('user', 'name email')
                .populate('category', 'name available'),
        ]);
        const pages = Math.ceil(total / limit);
        return {
            page,
            limit,
            total,
            pages,
            next: page < pages ? `/api/products?page=${page + 1}&limit=${limit}` : null,
            prev: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
            products,
        };
    }
}