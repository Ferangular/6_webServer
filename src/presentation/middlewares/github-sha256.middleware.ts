import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { envs } from '../../config/envs.js';

export class GithubSha256Middleware {
  static verifyGithubSignature(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const signature = req.header('x-hub-signature-256');

    if (!signature?.startsWith('sha256=')) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = `sha256=${createHmac('sha256', envs.GITHUB_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')}`;
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    const isValid = signatureBuffer.length === expectedSignatureBuffer.length
      && timingSafeEqual(signatureBuffer, expectedSignatureBuffer);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    next();
  }
}
