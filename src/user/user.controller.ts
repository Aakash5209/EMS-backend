import { Body, Controller, Get, Param, Post, Res, Delete, HttpException, HttpStatus } from '@nestjs/common';
import {UserService} from './user.service';
import { User } from './user.schema';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/getAllUser/:page/:limit')
    getAllUser(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response) : object {
        return this.userService.getAllUser(page, limit, res)
    }

    @Get('/getAllUserBySearch/:keyword/:page/:limit')
    getAllUserBySearch(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response, @Param('keyword') keyword:string) : object {
        return this.userService.getAllUserBySearch(page, limit, res, keyword)
    }

    @Get('/getbyrole/:role')
    getAllManager(@Param('role') role: string): object {
        return this.userService.getAllManager(role)
    }
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
      try {
        const result = await this.userService.deleteUserById(id);
        if (result.deletedCount === 0) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'User successfully deleted' };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Post('/getByColumnFilter/:keyword/:page/:limit')
    getByColumnFilter(@Body() FilterBody: object,@Param('keyword') keyword:string, @Param('page') page: string, @Param('limit') limit: string, @Res() res:Response): object {
        return this.userService.getByColumnFilter(FilterBody, page, limit, res, keyword)
    }

    @Post('/addUser')
    addUser(@Body() UserData: User): object {
        return this.userService.addUser(UserData)
    }
}
