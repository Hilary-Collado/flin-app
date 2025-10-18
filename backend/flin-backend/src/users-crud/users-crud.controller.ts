import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersCrudService } from './users-crud.service';
import { CreateUsersCrudDto } from './dto/create-users-crud.dto';
import { UpdateUsersCrudDto } from './dto/update-users-crud.dto';

@Controller('users-crud')
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @Post()
  create(@Body() createUsersCrudDto: CreateUsersCrudDto) {
    return this.usersCrudService.create(createUsersCrudDto);
  }

  @Get()
  findAll() {
    return this.usersCrudService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersCrudService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersCrudDto: UpdateUsersCrudDto) {
    return this.usersCrudService.update(+id, updateUsersCrudDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersCrudService.remove(+id);
  }
}
