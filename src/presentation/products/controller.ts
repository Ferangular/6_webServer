import { Request, Response } from 'express';
import { CreateProductDto, CustomError, PaginationDto, UserEntity } from '../../domain/index.js';
import { ProductService } from '../services/product.service.js';

export class ProductController {
    constructor(private readonly productService: ProductService) {}

    private handleError(error: unknown, res: Response): void {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }

    createProduct = async (req: Request, res: Response): Promise<void> => {
        const user = res.locals.user as UserEntity;
        const [error, dto] = CreateProductDto.create({ ...req.body, user: user.id });
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.status(201).json(await this.productService.createProduct(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };

    getProducts = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = PaginationDto.create(req.query.page, req.query.limit);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.json(await this.productService.getProducts(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };
}