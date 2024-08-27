import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryNotification, SalaryNotificationSchema } from './salary.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: SalaryNotification.name, schema: SalaryNotificationSchema }])],
  controllers: [SalaryController],
  providers: [SalaryService]
})
export class SalaryModule {}
