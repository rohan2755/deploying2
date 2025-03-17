import { Body, Controller, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { EditUserDto } from './dtos/edit-user.dto';

@Controller('profile')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  fetch(@CurrentUser() user: JwtUser) {
    return this.userService.findById(user.userId);
  }

  @Put()
  async edit(@CurrentUser() user: JwtUser, @Body() editUserDto: EditUserDto) {
    await this.userService.update(user.userId, editUserDto);
    return {
      message: 'Profile updated successfully',
    };
  }
}
