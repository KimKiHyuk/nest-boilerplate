/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/unbound-method */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import * as request from 'supertest';

import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UserEntity } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';

describe('Auth Unit test', () => {
    let app: INestApplication;
    let userService: UserService;
    let authController: AuthController;
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        validateUser: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                    },
                },
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        userService = app.get<UserService>(UserService);
        authController = app.get<AuthController>(AuthController);

        await app.init();
    });

    it('e2e 동작 테스트 (e2e 테스트로 분리 예정)', () =>
        request(app.getHttpServer()).get('/').expect(404));

    it('createUser', async () => {
        userService.createUser = jest.fn().mockResolvedValue(new UserEntity());

        await authController.userRegister({
            email: faker.internet.email(),
            firstName: faker.lorem.sentence(),
            lastName: faker.lorem.sentence(),
            password: faker.lorem.sentence(),
            phone: faker.phone.phoneNumber(),
        });
        expect(userService.createUser).toHaveBeenCalled();
    });

    afterAll(async () => {
        await app.close();
    });
});
