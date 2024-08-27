// import { UserSchema } from './../user/user.schema';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { Auth, AuthSchema } from './auth.schema';
import {User, UserSchema} from './user.schema'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'ThisIsAkashSecreatKey',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MongooseModule],
})

export class AuthModule { }
