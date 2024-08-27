import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SalaryModule } from './salary/salary.module';
import { Middleware } from './middleware/middleware';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env'
    }),
    MongooseModule.forRoot(
      process.env.URI
    ),
    UserModule,
    SalaryModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware)
      .forRoutes(
       
       
        {
          path: 'user/addUser',
          method: RequestMethod.POST
        },
        {
          path: 'salary/rejectSalary',
          method: RequestMethod.DELETE
        },
        {
          path: 'user/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'salary/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        
        {
          path: 'user/getAllUser/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'user/getAllUserBySearch/:keyword/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'salary/getAllUserSalaryByRole/:page/:limit',
          method: RequestMethod.GET
        },
        {
          path: 'auth/logout',
          method: RequestMethod.GET
        },
        {
          path: 'salary/updateSalary',
          method: RequestMethod.POST
        },
        {
          path: 'auth/cookiecheck',
          method: RequestMethod.GET
        },
        {
          path: 'auth/:email',
          method: RequestMethod.GET
        },
        {
          path: 'salary/approveSalary',
          method: RequestMethod.POST
        },
        {
          path: 'salary/getSalaryNotification',
          method: RequestMethod.GET
        },
        {
          path: 'user/getByColumnFilter/:keyword/:page/:limit',
          method: RequestMethod.POST
        },
        {
          path: 'user/getbyrole/:role',
          method: RequestMethod.GET
        },
        
      )
  }
}
