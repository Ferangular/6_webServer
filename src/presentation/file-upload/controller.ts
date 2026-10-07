import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { CustomError } from '../../domain/index.js';
import { FileUploadService } from '../services/file-upload.service.js';

export class FileUploadController {
    constructor(private readonly service: FileUploadService) {}

    private handleError(error: unknown, res: Response): void {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }

    uploadFile = async (req: Request, res: Response): Promise<void> => {
        try {
            const files = res.locals.files as UploadedFile[];
            res.status(201).json(await this.service.uploadSingle(files[0]!, String(req.params.type)));
        } catch (error) {
            this.handleError(error, res);
        }
    };

    uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
        try {
            const files = res.locals.files as UploadedFile[];
            res.status(201).json(await this.service.uploadMultiple(files, String(req.params.type)));
        } catch (error) {
            this.handleError(error, res);
        }
    };
}