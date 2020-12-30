import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiHeader,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { EmailVerifyException } from '../../exceptions/email-exceptions';
import { AuthGuard } from '../../guards/auth.guard';
import { UserDto } from '../user/dto/UserDto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly _userService: UserService,
        private readonly _authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const userEntity = await this._authService.validateUser(userLoginDto);

        const token = await this._authService.createToken(userEntity);
        return new LoginPayloadDto(userEntity.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
    ): Promise<UserDto> {
        const createdUser = await this._userService.createUser(userRegisterDto);

        return createdUser.toDto();
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer <JWT>',
    })
    @ApiBearerAuth('JWT')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }

    @Get('verify')
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'uuid' })
    @ApiOkResponse()
    async verifyUserByEmail(@Query('uuid') uuid) {
        const user = await this._userService.findOne(uuid);

        if (!user) {
            throw new EmailVerifyException();
        }

        const updated = await this._userService.updateUser(user);

        return updated.toDto();
    }
}
