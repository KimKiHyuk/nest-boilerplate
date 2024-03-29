import { Injectable } from '@nestjs/common';
import { first, last } from 'lodash';
import { FindConditions } from 'typeorm';

import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UsersPageDto } from './dto/UsersPageDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    /**
     * Find single user
     */
    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }

        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }

        return queryBuilder.getOne();
    }

    async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
        const user = this.userRepository.create({ ...userRegisterDto });

        return this.userRepository.save(user);
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        const [users, pageMetaDto] = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return new UsersPageDto(users.toDtos(), pageMetaDto);
    }

    async updateUser(userDto: UserEntity): Promise<UserEntity> {
        userDto.emailVerified = true;
        return this.userRepository.save(userDto);
    }

    // for Unittest demo, not works in real
    async getKoreanUserNameByUserId(userId: number) {
        const { firstName, lastName } = await this.userRepository.findOne(userId)
        
        // for demo jest.fn mocking
        const { status }  = await this.awsS3Service.collectApiHit()
        return {
            name: lastName + firstName,
            statusCode: status
        }
        
    }
}
