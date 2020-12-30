import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
    public uuid(): string {
        return uuid();
    }
    public fileName(ext: string): string {
        return this.uuid() + '.' + ext;
    }

    public jwtExpireUnixTime = (expiresIn: number) =>
        Math.floor(Date.now() / 1000) + expiresIn;
}
