import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import PasswordHash from "@utils/password/password-hash";
import BcryptPasswordHash from "@utils/password/bcrypt-password-hash";
import InvalidInputError from "@utils/api/user-input-error";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

export enum UserRole {
  MEMBER = "member",
  ADMIN = "admin",
}

registerEnumType(UserRole, {
  name: "UserRole",
});

const nameValidator = (name: string) => {
  return name.length > 1 && !/[^A-Za-z]/.test(name);
};

@pre<User>("validate", function (next) {
  // check if the user uses a password that contain either his first name
  // or the last name
  if (this.password) {
    if (
      this.password.indexOf(this.firstName) !== -1 ||
      this.password.indexOf(this.lastName) !== -1
    ) {
      throw new InvalidInputError(
        "password cannot contain the first name or the last name"
      );
    }
  }
  next();
})
@pre<User>("validate", function (next) {
  if (
    !(this.password || this.isThirdParty) ||
    (this.password && this.isThirdParty)
  ) {
    throw new InvalidInputError(
      "User must have a third party token or a password"
    );
  }
  next();
})
@pre<User>("save", async function (next) {
  if (this.password) {
    const passwordHash: PasswordHash = new BcryptPasswordHash();
    this.password = await passwordHash.hash(this.password);
  }
  next();
})
@pre<User>("save", function (next) {
  this.userId = this._id;
  next();
})
@ObjectType()
export class User {
  @prop({ index: true, unique: true })
  @Field(() => ID)
  userId: ObjectId;

  @prop({
    required: true,
    validate: {
      validator: (value: string) => {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          value
        );
      },
    },
  })
  @Field()
  public email: string;

  @prop({
    required: true,
    validate: {
      validator: nameValidator,
      message: "Invalid first name",
    },
  })
  @Field()
  public firstName: string;

  @prop({
    required: true,
    validate: {
      validator: nameValidator,
      message: "Invalid last name",
    },
  })
  @Field()
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
  public password?: string;

  @prop()
  public isThirdParty: boolean;

  @Field(() => UserRole)
  @prop({ enum: UserRole, default: UserRole.MEMBER })
  public role: UserRole;

  @prop({ default: 0 })
  public tokenVer: number;
}

const UserModel = getModelForClass(User);

export default UserModel;
