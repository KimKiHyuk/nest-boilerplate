/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/unbound-method */
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UserService } from '../../src/modules/user/user.service';
import { UserController } from '../../src/modules/user/user.controller';
import { UserRepository } from '../../src/modules/user/user.repository';
import { ValidatorService } from '../../src/shared/services/validator.service';
import { AwsS3Service } from '../../src/shared/services/aws-s3.service';
import { UserEntity } from '../../src/modules/user/user.entity';

describe('User Unit test', () => {
    let app: INestApplication;
    let userService: UserService;
    let userController: UserController;
    let userRepository: UserRepository;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                UserRepository,
                ValidatorService,
                {
                    provide: AwsS3Service,
                    useValue: {
                        collectApiHit: jest.fn(() => {
                            return {
                                status: 200
                            }
                        })
                    }
                }
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        userService = app.get<UserService>(UserService);
        userController = app.get<UserController>(UserController);
        userRepository = app.get<UserRepository>(UserRepository);

        await app.init();
    });


    const testcases1 = [
        [
            { userId: 0, firstName: "기혁", lastName: "김" },
            { koreanName: "김기혁" }
        ],
        [
            { userId: 1, firstName: "기혁", lastName: "박" },
            { koreanName: "박기혁" }
        ],
        [
            { userId: 999, firstName: "기혁", lastName: "이" },
            { koreanName: "이기혁" }
        ]
    ]
    const testcases2 = [
        [
            { userId: 1001 }
        ],
        [
            { userId: 1002 }
        ],
        [
            { userId: 2000 }
        ]
    ]
    it.each(testcases1)('translate english name %s to korean name %s', async (input, output) => {
        const mockUserRepository = jest.spyOn(userRepository, "findOne")
            .mockResolvedValue((() => {
                const user = new UserEntity()
                user.firstName = input.firstName;
                user.lastName = input.lastName;
                return user;
            })())


        var res = await userController.getKoreanUserName(input.userId)

        expect(mockUserRepository).toHaveBeenCalled()
        expect(res.koreanName).toEqual(output.koreanName)
        expect(res.statusCode).toEqual(200)
        
    });

    it.each(testcases2)('When userId > 1000, throw 401 Exception %s', async (input) => {
        await expect(userController.getKoreanUserName(input.userId))
            .rejects
            .toThrowError(UnauthorizedException)
    });

    afterAll(async () => {
        await app.close();
    });
});
