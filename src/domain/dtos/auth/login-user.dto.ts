import { regularExps } from '../../../config/index.js';

export class LoginUserDto {
    private constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}

    static create(object: Record<string, unknown>): [string | undefined, LoginUserDto | undefined] {
        const { email, password } = object;
        if (typeof email !== 'string' || email.trim().length === 0) return ['Missing email', undefined];
        if (!regularExps.email.test(email)) return ['Email is not valid', undefined];
        if (typeof password !== 'string') return ['Missing password', undefined];
        if (password.length < 6) return ['Password too short', undefined];
        return [undefined, new LoginUserDto(email.trim().toLowerCase(), password)];
    }
}
