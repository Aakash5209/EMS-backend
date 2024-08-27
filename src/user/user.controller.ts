import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import {UserService} from './user.service';
import { User } from './user.schema';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userThingsService: UserService) {}

    @Get('/getAllUser/:page/:limit')
    getAllUser(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response) : object {
        return this.userThingsService.getAllUser(page, limit, res)
    }

    @Get('/getAllUserBySearch/:keyword/:page/:limit')
    getAllUserBySearch(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response, @Param('keyword') keyword:string) : object {
        return this.userThingsService.getAllUserBySearch(page, limit, res, keyword)
    }

    @Get('/getbyrole/:role')
    getAllManager(@Param('role') role: string): object {
        return this.userThingsService.getAllManager(role)
    }

    @Post('/getByColumnFilter/:keyword/:page/:limit')
    getByColumnFilter(@Body() FilterBody: object,@Param('keyword') keyword:string, @Param('page') page: string, @Param('limit') limit: string, @Res() res:Response): object {
        return this.userThingsService.getByColumnFilter(FilterBody, page, limit, res, keyword)
    }

    @Post('/addUser')
    addUser(@Body() UserData: User): object {
        return this.userThingsService.addUser(UserData)
    }
}
