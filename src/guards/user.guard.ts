import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private readonly _userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const uuid = request.query?.uuid;

        const user = await this._userService.findOne({
            id: uuid,
        });

        if (!user) {
            throw new UserNotFoundException();
        }

        request.user = user;
        return true;
    }
}
