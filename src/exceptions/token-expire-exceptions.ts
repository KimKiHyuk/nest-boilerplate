'use strict';

import { UnauthorizedException } from '@nestjs/common';

export class TokenExpiredException extends UnauthorizedException {
    constructor(error?: string) {
        super('error.token_expired_error', error);
    }
}
