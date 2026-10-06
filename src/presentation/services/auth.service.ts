import { bcryptAdapter, JwtAdapter } from '../../config/index.js';
import { UserModel } from '../../data/index.js';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain/index.js';

export class AuthService {
    async registerUser(dto: RegisterUserDto) {
        const existingUser = await UserModel.findOne({ email: dto.email });
        if (existingUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = await UserModel.create({ ...dto, password: bcryptAdapter.hash(dto.password) });
            const { password, ...userEntity } = UserEntity.fromObject(user.toObject());
            const token = await JwtAdapter.generateToken({ id: userEntity.id, email: userEntity.email });
            if (!token) throw CustomError.internalServer('Error while creating JWT');
            return { user: userEntity, token };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer('Unable to register user');
        }
    }

    async loginUser(dto: LoginUserDto) {
        const user = await UserModel.findOne({ email: dto.email });
        if (!user) throw CustomError.badRequest('Email does not exist');
        if (!bcryptAdapter.compare(dto.password, user.password)) throw CustomError.badRequest('Password is not valid');

        const { password, ...userEntity } = UserEntity.fromObject(user.toObject());
        const token = await JwtAdapter.generateToken({ id: userEntity.id, email: userEntity.email });
        if (!token) throw CustomError.internalServer('Error while creating JWT');
        return { user: userEntity, token };
    }
}
