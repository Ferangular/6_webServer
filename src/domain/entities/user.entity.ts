import { CustomError } from '../errors/custom.error.js';

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly emailValidated: boolean,
        public readonly password: string,
        public readonly roles: string[],
        public readonly img?: string,
    ) {}

    static fromObject(object: Record<string, unknown>): UserEntity {
        const id = String(object._id ?? object.id ?? '');
        const { name, email, emailValidated, password, roles, img } = object;
        if (!id) throw CustomError.badRequest('Missing id');
        if (typeof name !== 'string') throw CustomError.badRequest('Missing name');
        if (typeof email !== 'string') throw CustomError.badRequest('Missing email');
        if (typeof emailValidated !== 'boolean') throw CustomError.badRequest('Missing emailValidated');
        if (typeof password !== 'string') throw CustomError.badRequest('Missing password');
        if (!Array.isArray(roles)) throw CustomError.badRequest('Missing roles');
        return new UserEntity(id, name, email, emailValidated, password, roles.map(String), typeof img === 'string' ? img : undefined);
    }
}
