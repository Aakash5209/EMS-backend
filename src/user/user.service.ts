import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Response } from 'express';
import { SalaryNotification, SalaryNotificationDocument } from '../salary/salary.schema'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(SalaryNotification.name) private salaryNotificationModel: Model<SalaryNotificationDocument>
) { }

    private readonly saltRounds = 10;

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt?.genSalt(this.saltRounds)
        const hash = await bcrypt?.hash(password, salt);
        return hash;
    }

    async getAllUser(page: string, limit: string, res: Response): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const total = await this.userModel.countDocuments().exec();
        const User = await this.userModel.find().select('-password').skip(skip).limit(realLimit).exec();
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        }

        return res.json({ User, extraInfo });
    }

    async getAllUserBySearch(page: string, limit: string, res: Response, keyword: string): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

      
        const filter = keyword
            ? {
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { contactNo: { $regex: keyword, $options: 'i' } },
                    { gender: { $regex: keyword, $options: 'i' } },
                    { role: { $regex: keyword, $options: 'i' } },
                ],
            }
            : {};

        const total = await this.userModel.countDocuments(filter).exec();
        const User = await this.userModel
            .find(filter)
            .select('-password -salary')
            .skip(skip)
            .limit(realLimit)
            .exec();

        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };

        return res.json({ User, extraInfo });
    }
    // async deleteUserById(id: string): Promise<{ deletedCount: number }> {
    //     const result = await this.userModel.deleteOne({ id }).exec();
    //     return { deletedCount: result.deletedCount };
    //   }

    async deleteUserById(id: string): Promise<{ deletedCount: number }> {
        // Convert the string id to ObjectId
        const objectId = new Types.ObjectId(id);

        // Delete the user by ObjectId
        const result = await this.userModel.deleteOne({ _id: objectId }).exec();

        // Check if the user was deleted
        if (result.deletedCount > 0) {
            // Delete associated salary notifications for the deleted user
            await this.salaryNotificationModel.deleteMany({ showTo: objectId }).exec();
        }

        return { deletedCount: result.deletedCount };
    }
    
    // async deleteUserById(id: string): Promise<{ deletedCount: number }> {
    //     // Delete the user
    //     const result = await this.userModel.deleteOne({ id }).exec();
      
    //     // Check if the user was deleted
    //     if (result.deletedCount > 0) {
    //       // Delete associated salary records
    //       await this.salaryNotificationModel.deleteMany({ showTo: id }).exec();
    //     }
      
    //     return { deletedCount: result.deletedCount };
    //   }
    
    async getAllManager(role: string): Promise<object> {
        const Manager = await this.userModel.find({ role }).select('-password -salary')
        return { manager: Manager }
    }

    async addUser(userData: User) {
        console.log(userData);
        userData.password = await this.hashPassword(userData.password);
        userData.email = userData.email.toLowerCase();
        if (userData.reporting_manager !== '') {
            userData.reporting_manager = new Types.ObjectId(userData.reporting_manager)
        } else {
            userData.reporting_manager = ''
        }
        console.log(userData);
        const user = await this.userModel.create(userData)
        if (!user) {
            return { msg: 'user creation failed' }
        }

        const findUser = await this.userModel.findById(user._id)

        return { findUser, msg: 'user created successfully!!' }
    }

    async getByColumnFilter(FilterBody: object, page: string, limit: string, res: Response, keyword: string): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

       

        
        const filter: Record<string, any> = {};

        Object.keys(FilterBody).forEach(key => {
            if (FilterBody[key]) {
                filter[key] = { $regex: FilterBody[key], $options: 'i' }; 
            }
        });

        let User = null;
        let total = null;
        if (keyword !== 'null') {
            total = await this.userModel.countDocuments({
                ...filter, $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { contactNo: { $regex: keyword, $options: 'i' } },
                    { gender: { $regex: keyword, $options: 'i' } },
                    { role: { $regex: keyword, $options: 'i' } },
                ]
            }).exec();
            User = await this.userModel
                .find({
                    ...filter, $or: [
                        { firstName: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                        { id: { $regex: keyword, $options: 'i' } },
                        { lastName: { $regex: keyword, $options: 'i' } },
                        { contactNo: { $regex: keyword, $options: 'i' } },
                        { gender: { $regex: keyword, $options: 'i' } },
                        { role: { $regex: keyword, $options: 'i' } },
                    ]
                })
                .select('-password -salary')
                .skip(skip)
                .limit(realLimit)
        } else {
            total = await this.userModel.countDocuments(filter).exec();
            User = await this.userModel
                .find(filter)
                .select('-password -salary')
                .skip(skip)
                .limit(realLimit)
        }


        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };

        return res.json({ User, extraInfo });
    }
}