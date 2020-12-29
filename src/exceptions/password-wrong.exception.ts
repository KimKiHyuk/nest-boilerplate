'use strict';

import { UnauthorizedException } from '@nestjs/common';

export class PasswordWrongException extends UnauthorizedException {
    constructor(error?: string) {
        super('error.password_wrong', error);
    }
}
