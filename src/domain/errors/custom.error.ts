export class CustomError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 400,
    ) {
        super(message);
        this.name = 'CustomError';
    }

    static badRequest(message: string): CustomError {
        return new CustomError(message, 400);
    }

    static notFound(message: string): CustomError {
        return new CustomError(message, 404);
    }
}
