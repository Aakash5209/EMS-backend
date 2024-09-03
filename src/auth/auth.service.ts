import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
// import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserDocument,User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
    private jwtService: JwtService
  ) {}

  private readonly saltRounds = 10; 

  async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt?.genSalt(this.saltRounds)
      const hash = await bcrypt?.hash(password, salt);
      return hash;
  }

  // async cookieCheck(req: Request, res: Response): Promise<object> {
  //   console.log("req-cookie",req)
  //   return res.json({user: await this.userModel.find({email: req['user']['email']}).select('-password')})
  // }

  async cookieCheck(req: Request, res: Response): Promise<object> {
    try {
      // Find the user and populate the reporting_manager field
      const user = await this.userModel
        .findOne({ email: req['user']['email'] })
        .select('-password')  // Exclude the password field
        .populate('reporting_manager', 'email id firstName lastName');  // Populate reporting_manager with necessary fields
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Extract reporting manager details if available
      const reportingManager = user.reporting_manager
        ? {
            _id: user.reporting_manager['_id'],
            id: user.reporting_manager['id'],
            email: user.reporting_manager['email'],
            firstName: user.reporting_manager['firstName'],
            lastName: user.reporting_manager['lastName']
          }
        : null;
  
      // Construct the response object with two separate objects in the user array
      const response = {
        user: [
          {
            _id: user._id,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNo: user.contactNo,
            role: user.role,
            gender: user.gender,
            dob: user.dob,
            salary: user.salary
          },
          reportingManager  // Add reporting manager as the second object
        ]
      };
  
      return res.json(response);
    } catch (error) {
     
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  


  async getAdmin(email:string): Promise<object> {
    const obj = await this.userModel.findOne({email: email.toLowerCase()}).select('-password -salary')
    return {obj}
  }

  async loginUser(userData:object,  res: Response): Promise<object> {
   
    const email = userData['email'].toLowerCase();
    const user = await this.userModel.findOne({email: email})

    if (!user) {
      throw new UnauthorizedException('Credentials are incorrect');
    }


    const checkPassword = await bcrypt.compare(userData['password'], user.password)

    if(!checkPassword) {
      throw new UnauthorizedException('Credentials are incorrect');
    }

    const payload = { email: user.email, role: user.role, _id: user._id };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,      
      maxAge: 3600000,
      path: '/',
      sameSite: 'none'
    })

    return res.json({ user, msg: 'Login successful' });    
  }

  logout(res: Response): object {
    res.clearCookie('jwt',{
      httpOnly: true,
      secure: true,      
      path: '/',
      sameSite: 'none'
    });
    return res.json({ msg: 'Logout successful' });
  }
  test1(): string {
    return 'Hello World!';
  }

  
}
