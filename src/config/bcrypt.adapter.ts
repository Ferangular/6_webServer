import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
    hash(password: string): string {
        return hashSync(password, genSaltSync());
    },
    compare(password: string, hashed: string): boolean {
        return compareSync(password, hashed);
    },
};
