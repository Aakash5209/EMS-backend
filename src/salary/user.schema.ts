import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

const Role = ['Admin', 'Employee', 'Manager', 'Team Leader']
const Gender = ['Male', 'Female']

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
  role: string;

  @Prop({ required: true, enum: Gender })
  gender: string;
  
  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  salary: Number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true  })
  reporting_manager: Types.ObjectId;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);