import { Request, Response } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain/index.js';
import { CategoryService } from '../services/category.service.js';

export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    private handleError(error: unknown, res: Response): void {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }

    createCategory = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = CreateCategoryDto.create(req.body);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            const user = res.locals.user as UserEntity;
            res.status(201).json(await this.categoryService.createCategory(dto, user));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };

    getCategories = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = PaginationDto.create(req.query.page, req.query.limit);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.json(await this.categoryService.getCategories(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };
}