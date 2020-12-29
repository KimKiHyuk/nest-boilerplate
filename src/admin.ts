import * as AdminBroExpress from '@admin-bro/express';
import { Database, Resource } from '@admin-bro/typeorm';
import { NestFactory } from '@nestjs/core';
import AdminBro from 'admin-bro';

import { AppModule } from './app.module';
import { UserEntity } from './modules/user/user.entity';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

async function runAdmin() {
    // Nest.js App 생성
    const app = await NestFactory.create(AppModule);

    // AdminBro Adapter 등록
    AdminBro.registerAdapter({ Database, Resource });

    // AdminBro router 생성
    const adminBro = new AdminBro({
        resources: [{ resource: UserEntity }],
        rootPath: '/admin',
    });
    const router = AdminBroExpress.buildRouter(adminBro);

    const configService = app.select(SharedModule).get(ConfigService);

    // Nest.js AdminBro 연결
    app.use(adminBro.options.rootPath, router);

    const port = configService.getNumber('ADMIN_PORT');

    // App 실행
    await app.listen(port);

    console.info(`Nest.js AdminBro is running on ${port}`);
}

void runAdmin();
