import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByPhone(phone: string) {
    return this.userRepository.findOne({
      where: {
        phone: phone,
      },
    });
  }

  create(user: CreateUserDto) {
    return this.userRepository.insert(user);
  }
}
