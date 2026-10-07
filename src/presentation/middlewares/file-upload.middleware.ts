import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

export class FileUploadMiddleware {
    static containFiles(req: Request, res: Response, next: NextFunction): void {
        const uploaded = req.files?.file;
        if (!uploaded) {
            res.status(400).json({ error: 'No files were selected under field file' });
            return;
        }
        const files = (Array.isArray(uploaded) ? uploaded : [uploaded]) as UploadedFile[];
        if (files.some((file) => file.truncated)) {
            res.status(413).json({ error: 'A file exceeds the size limit' });
            return;
        }
        res.locals.files = files;
        next();
    }
}