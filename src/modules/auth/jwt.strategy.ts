import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        public readonly configService: ConfigService,
        public readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    /**
     * Validates jwt strategy
     * Passport 내부적으로 JWT 인증을 도와줌.
     * 시간이 지난 토큰이나 잘못된 토큰은 passport단에서 막힌다
     * 최소한 검증된 토큰으로 사용자 검사를 진행한다.
     * @param { id: userId }
     * @returns UserEntity
     */
    async validate({ id: userId }) {
        // const timeDiff = exp - UtilsService.getNowUnixTime();
        // if (timeDiff <= 0) {
        //     throw new TokenExpiredException();
        // }

        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
