import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

enum Role {
  Admin = 'Admin',
  Employee = 'Employee',
  Manager = 'Manager',
  TeamLeader = 'Team Leader',
}

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

@Schema()
export class User {
  @Prop({required: true, unique:true})
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true})
  lastName: string;

  @Prop({ required: true, unique:true })
  email: string;

  @Prop({ required: true , minlength: 10, maxlength:13})
  contactNo: string;
  
  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ required: true, enum: Gender })
  gender: Gender;
  
  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  salary: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true  })
  reporting_manager?: Types.ObjectId | '';

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);