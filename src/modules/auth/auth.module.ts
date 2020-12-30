import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { GeneratorService } from '../../shared/services/generator.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GeneratorService],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}
