import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/common/entities/user.entity';
import { EditUserDto } from './dtos/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findById(id: number) {
    return this.userRepository.findOne({
      select: {
        name: true,
        username: true,
        phone: true,
        email: true,
        bio: true,
        kyc_status: true,
      },
      where: { id: id },
    });
  }

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

  update(userId: number, editUserDto: EditUserDto) {
    return this.userRepository.update({ id: userId }, editUserDto);
  }
}
