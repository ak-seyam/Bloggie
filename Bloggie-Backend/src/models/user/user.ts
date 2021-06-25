import {
  prop,
  getModelForClass,
  pre,
  index,
  ModelOptions,
  post,
} from "@typegoose/typegoose";
import PasswordHash from "@utils/password/password-hash";
import BcryptPasswordHash from "@utils/password/bcrypt-password-hash";
import UserInputError from "@utils/database/user-input-error";
import { ObjectId } from "mongodb";

enum Role {
  MEMBER = "member",
  ADMIN = "admin",
}

const nameValidator = (name: string) => {
  return name.length > 1 && !/[^A-Za-z]/.test(name);
};

@pre<User>("validate", function (next) {
  // check if the user uses a password that contain either his first name
  // or the last name
  if (
    this.password.indexOf(this.firstName) !== -1 ||
    this.password.indexOf(this.lastName) !== -1
  ) {
    throw new UserInputError(
      "password cannot contain the first name or the last name"
    );
  }
  next();
})
@pre<User>("save", async function (next) {
  const passwordHash: PasswordHash = new BcryptPasswordHash();
  this.password = await passwordHash.hash(this.password);
  next();
})
@pre<User>("save", function (next) {
  this.userId = this._id;
  next();
})
export class User {
  @prop({ index: true, unique: true })
  userId: ObjectId;

  @prop({
    required: true,
    validate: {
      validator: (value: string) => {
        return /[A-Za-z1-9._]+@[a-z]+\.[a-z]{2,}/.test(value);
      },
    },
  })
  public email: string;

  @prop({
    required: true,
    validate: {
      validator: nameValidator,
      message: "Invalid first name",
    },
  })
  public firstName: string;

  @prop({
    required: true,
    validate: {
      validator: nameValidator,
      message: "Invalid last name",
    },
  })
  public lastName: string;

  @prop({
    validate: {
      validator: (value: string) => {
        return (
          value.length > 8 &&
          /[A-Z]/.test(value) &&
          /[^\w]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value)
        );
      },
      message:
        "Weak password, password must include at least a single uppercase letter, lowercase letter, number, special character, and be greater than 8 characters",
    },
  })
  public password: string;

  @prop()
  public isThirdParty: boolean;

  @prop({ enum: Role, default: Role.MEMBER })
  public role: Role;

  @prop({ default: 0 })
  public tokenVer: number;
}

const UserModel = getModelForClass(User);

export default UserModel;
