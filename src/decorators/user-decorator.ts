import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
