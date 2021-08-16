import UserLogic from "@services/data-interaction/user/user-logic";
import ArticleModel, { Article } from "@models/article/article";
import UserModel, { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import InvalidInputError from "@utils/api/user-input-error";
import { ObjectId } from "mongodb";

export default class UserLogicImpl implements UserLogic {
  async getArticlesByUser(
    authorId: ObjectId,
    limit: number,
    fromId?: ObjectId
  ): Promise<DocumentType<Article>[]> {
    const res = await ArticleModel.find({
      $and: [
        { author: authorId },
        fromId
          ? {
              _id: {
                $gt: fromId,
              },
            }
          : {},
      ],
    })
      .populate("author")
      .sort({ _id: 1 })
      .limit(limit);
    return res;
  }
  async updateUser(
    userId: ObjectId,
    newData: User
  ): Promise<DocumentType<User>> {
    let res;
    try {
      res = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: newData },
        { new: true, runValidators: true }
      );
    } catch (e) {
      throw new InvalidInputError(e.message);
    }
    if (!res) throw new InvalidInputError("Invalid user id");
    return res;
  }
  async createUser(user: User): Promise<DocumentType<User>> {
    let res;
    try {
      res = await UserModel.create(user);
    } catch (e) {
      throw new InvalidInputError(e.message);
    }
    return res;
  }
  async deleteUser(userId: ObjectId): Promise<boolean> {
    const res = await UserModel.deleteOne({ _id: userId });
    return res.ok === 1 && res.deletedCount !== 0;
  }
  async getUserById(userId: ObjectId): Promise<DocumentType<User>> {
    const res = await UserModel.findOne({ _id: userId });
    if (!res) throw new InvalidInputError("Invalid user id");
    return res;
  }
  async getUserByEmail(email: string): Promise<DocumentType<User>> {
    const res = await UserModel.findOne({ email: email });
    if (!res) throw new InvalidInputError("Email not found");
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
    if (!res.length) throw new InvalidInputError("No users");
    return res;
  }
}
