import UserLogic from "@controller/user/user-logic";
import { Article } from "@models/article/article";
import UserModel, { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import UserInputError from "@utils/database/user-input-error";
import { ObjectId } from "mongodb";

export default class UserLogicImpl implements UserLogic {
  getAllArticles(
    authorId: ObjectId,
    fromId: ObjectId,
    limit: number
  ): Promise<DocumentType<Article>[]> {
    throw new Error("Method not implemented.");
  }
  async updateUser(
    userId: ObjectId,
    newData: User
  ): Promise<DocumentType<User>> {
    const res = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: newData },
      { new: true }
    );
    if (!res) throw new UserInputError("Invalid user id");
    return res;
  }
  async createUser(user: User): Promise<DocumentType<User>> {
    return UserModel.create(user);
  }
  async deleteUser(userId: ObjectId): Promise<boolean> {
    const res = await UserModel.deleteOne({ _id: userId });
    return res.ok === 1 && res.deletedCount !== 0;
  }
  async getUserById(userId: ObjectId): Promise<DocumentType<User>> {
    const res = await UserModel.findOne({ _id: userId });
    if (!res) throw new UserInputError("Invalid user id");
    return res;
  }
  async getUserByEmail(email: string): Promise<DocumentType<User>> {
    const res = await UserModel.findOne({ email: email });
    if (!res) throw new UserInputError("Email not found");
    return res;
  }
  async getUsers(
    limit: number,
    after?: ObjectId
  ): Promise<DocumentType<User>[]> {
    const res = await UserModel.find(
      after
        ? {
            _id: {
              $gt: after,
            },
          }
        : {}
    )
      .sort({ _id: 1 })
      .limit(limit);
    if (!res.length) throw new UserInputError("No users");
    return res;
  }
}
