import { Article } from "@models/article/article";
import { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";

export default interface UserLogic {
  createUser(user: User): Promise<DocumentType<User>>;
  // the new user is a user to insure consistent structure of the documents
  updateUser(userId: ObjectID, newData: User): Promise<DocumentType<User>>;
  /**
   * Delete the user account
   *
   * @param {ObjectID} userId the object id used in mongodb
   * @returns true if everything went ok false otherwise
   */
  deleteUser(userId: ObjectID): Promise<boolean>;
  getUserById(userId: ObjectID): Promise<DocumentType<User>>;
  getUserByEmail(email: string): Promise<DocumentType<User>>;
  /**
   * get users after the _after_ cursor
   *
   * **Note:** when from Id is undefined it should start from the
   * first id otherwise it should return after the passed id
   *
   * @param limit
   * @param after the cursor id
   */
  getUsers(limit: number, after?: ObjectID): Promise<DocumentType<User>[]>;
}
