import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain/index.js';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private handleError(error: unknown, res: Response): void {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }

    registerUser = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = RegisterUserDto.create(req.body);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.status(201).json(await this.authService.registerUser(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };

    loginUser = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = LoginUserDto.create(req.body);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.json(await this.authService.loginUser(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };
}
