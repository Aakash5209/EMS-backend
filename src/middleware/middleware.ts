import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';  


@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, _:Response , next: NextFunction) {
    const cookieHeader = req?.rawHeaders[req?.rawHeaders?.indexOf("Cookie") + 1]

    if (!cookieHeader) {
      throw new UnauthorizedException('cookies not found');
    }

    
    const jwtToken = cookieHeader.split('; ').find(cookie => cookie.startsWith('jwt='));
    if (!jwtToken) {
      throw new UnauthorizedException(' JWT token not found in cookies');
    }

    
    const token = jwtToken.split('=')[1];


    
    const secretKey = 'ThisIsAkashSecreatKey';
    const decoded = jwt.verify(token, secretKey);


    req['user'] = decoded;

    next();
  }
}

