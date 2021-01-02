'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UsersPageDto } from './dto/UsersPageDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UserController {
    constructor(private _userService: UserService) {}

    @Get('users')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users list',
        type: UsersPageDto,
    })
    getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        return this._userService.getUsers(pageOptionsDto);
    }
}
