import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalaryNotificationDocument = SalaryNotification & Document;

const Role = ['Employee', 'Manager', 'Team Leader']

@Schema()
export class SalaryNotification {
  
  @Prop({type: Types.ObjectId, ref: 'User', required: true })
  showTo: Types.ObjectId

  @Prop({required: true})
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true})
  lastName: string;

  @Prop({ required: true })
  email: string;
  
  @Prop({ required: true, enum: Role })
  role: string;

  @Prop({ required: true })
  currentSalary: Number;

  @Prop({ required: true })
  updatedSalary: Number;
}

export const SalaryNotificationSchema = SchemaFactory.createForClass(SalaryNotification);