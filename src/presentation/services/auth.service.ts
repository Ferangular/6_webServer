import { bcryptAdapter, envs, JwtAdapter } from '../../config/index.js';
import { UserModel } from '../../data/index.js';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain/index.js';
import { EmailService } from './email.service.js';

export class AuthService {
    constructor(private readonly emailService: EmailService) {}

    async registerUser(dto: RegisterUserDto) {
        const existingUser = await UserModel.findOne({ email: dto.email });
        if (existingUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = await UserModel.create({ ...dto, password: bcryptAdapter.hash(dto.password) });
            await this.sendEmailValidationLink(user.email);
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

    private async sendEmailValidationLink(email: string): Promise<void> {
        const token = await JwtAdapter.generateToken({ email }, '15m');
        if (!token) throw CustomError.internalServer('Error while creating email token');

        const link = `${envs.WEBSERVICE_URL}/api/auth/validate-email/${encodeURIComponent(token)}`;
        const wasSent = await this.emailService.sendEmail({
            to: email,
            subject: 'Validate your email',
            htmlBody: `<h1>Validate your email</h1><p>Click the following link to validate your account:</p><a href="${link}">Validate ${email}</a>`,
        });
        if (!wasSent) throw CustomError.internalServer('Error sending validation email');
    }

    async validateEmail(token: string): Promise<void> {
        const payload = await JwtAdapter.validateToken<{ email?: string }>(token);
        if (!payload) throw CustomError.unauthorized('Invalid or expired token');
        if (!payload.email) throw CustomError.badRequest('Email is missing from token');

        const user = await UserModel.findOne({ email: payload.email });
        if (!user) throw CustomError.notFound('User does not exist');
        if (!user.emailValidated) {
            user.emailValidated = true;
            await user.save();
        }
    }
}