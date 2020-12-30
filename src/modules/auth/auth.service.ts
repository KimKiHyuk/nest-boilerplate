import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordWrongException } from '../../exceptions/password-wrong.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { ContextService } from '../../providers/context.service';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { GeneratorService } from '../../shared/services/generator.service';
import { UserDto } from '../user/dto/UserDto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';

    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        public readonly generateService: GeneratorService,
    ) {}

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        const exp = this.generateService.jwtExpireUnixTime(
            this.configService.getNumber('JWT_EXPIRATION_TIME'),
        );

        return new TokenPayloadDto({
            expiresIn: exp,
            accessToken: await this.jwtService.signAsync({
                exp,
                id: user.id,
            }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.userService.findOne({
            email: userLoginDto.email,
        });
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );

        if (!user) {
            throw new UserNotFoundException();
        }
        if (!isPasswordValid) {
            throw new PasswordWrongException();
        }

        return user;
    }

    static setAuthUser(user: UserEntity) {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
