import { access } from 'fs/promises';
import path from 'path';
import { Request, Response } from 'express';

const VALID_TYPES = new Set(['users', 'products', 'categories']);
const VALID_FILE_NAME = /^[0-9a-f-]+\.(png|jpg|gif|webp)$/i;

export class ImageController {
    getImage = async (req: Request, res: Response): Promise<void> => {
        const { type, img } = req.params;
        if (typeof type !== 'string' || typeof img !== 'string' || !VALID_TYPES.has(type) || !VALID_FILE_NAME.test(img)) {
            res.status(400).json({ error: 'Invalid image path' });
            return;
        }
        const imagePath = path.resolve(process.cwd(), 'uploads', type, img);
        try {
            await access(imagePath);
            res.sendFile(imagePath);
        } catch {
            res.status(404).json({ error: 'Image not found' });
        }
    };
}