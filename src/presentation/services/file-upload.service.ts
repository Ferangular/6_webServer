import { mkdir } from 'fs/promises';
import path from 'path';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from '../../config/uuid.adapter.js';
import { CustomError } from '../../domain/index.js';

const MIME_EXTENSIONS: Readonly<Record<string, string>> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
};

export class FileUploadService {
    constructor(private readonly uuid: () => string = Uuid.v4) {}

    async uploadSingle(file: UploadedFile, type: string): Promise<{ fileName: string }> {
        const extension = MIME_EXTENSIONS[file.mimetype];
        if (!extension) throw CustomError.badRequest(`Invalid MIME type: ${file.mimetype}`);
        if (file.size === 0) throw CustomError.badRequest('Empty files are not allowed');

        const destination = path.resolve(process.cwd(), 'uploads', type);
        await mkdir(destination, { recursive: true });
        const fileName = `${this.uuid()}.${extension}`;
        await file.mv(path.join(destination, fileName));
        return { fileName };
    }

    uploadMultiple(files: UploadedFile[], type: string): Promise<{ fileName: string }[]> {
        return Promise.all(files.map((file) => this.uploadSingle(file, type)));
    }
}