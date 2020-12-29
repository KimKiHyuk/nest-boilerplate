'use strict';

import { UnauthorizedException } from '@nestjs/common';

export class EmailVerifyException extends UnauthorizedException {
    constructor(error?: string) {
        super('error.email_verfication_error', error);
    }
}
