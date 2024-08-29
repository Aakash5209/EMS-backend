import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {User, UserSchema} from './user.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryNotification, SalaryNotificationSchema } from '../salary/salary.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    { name: SalaryNotification.name, schema: SalaryNotificationSchema } 
  ])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
