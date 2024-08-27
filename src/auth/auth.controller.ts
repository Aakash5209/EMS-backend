// import { Auth } from './auth.schema';
import { User } from './user.schema';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) { }

  @Get('/check-cookie')
  cookieCheck(@Req() req: Request, @Res() res: Response): object {
    return this.userService.cookieCheck(req, res)
  }

  @Post('/login')
  loginUser(@Body() userData: object, @Res() res: Response): object {
    console.log("-",userData)
    return this.userService.loginUser(userData, res);
  }

  @Get('/logout')
  logout(@Res() res: Response): object {
    return this.userService.logout(res)
  }

  @Get('/:email')
  getAdmin(@Param('email') email: string): object {
    return this.userService.getAdmin(email);
  }
  @Get('/test1')
  testing(): string {
    return this.userService.test1();
  }
}
