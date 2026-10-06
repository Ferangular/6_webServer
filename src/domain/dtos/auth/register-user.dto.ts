import { regularExps } from '../../../config/index.js';

export class RegisterUserDto {
    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ) {}

    static create(object: Record<string, unknown>): [string | undefined, RegisterUserDto | undefined] {
        const { name, email, password } = object;
        if (typeof name !== 'string' || name.trim().length === 0) return ['Missing name', undefined];
        if (typeof email !== 'string' || email.trim().length === 0) return ['Missing email', undefined];
        if (!regularExps.email.test(email)) return ['Email is not valid', undefined];
        if (typeof password !== 'string') return ['Missing password', undefined];
        if (password.length < 6) return ['Password too short', undefined];
        return [undefined, new RegisterUserDto(name.trim(), email.trim().toLowerCase(), password)];
    }
}
