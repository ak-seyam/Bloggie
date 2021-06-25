import { User } from "@models/user/user";
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@pre<Article>("save", function (next) {
  this.articleId = this._id;
  next();
})
export class Article {
  @prop({ index: true, unique: true })
  articleId: ObjectId;
  @prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return value.split(" ").length > 1;
      },
      message: "Invalid title, it should be more than a one word",
    },
  })
  title: string;

  @prop({ required: true, ref: () => User })
  author: Ref<User>;

  @prop({ required: true, minlength: [150, "Article too short"] })
  content: string;
}

const ArticleModel = getModelForClass(Article);
export default ArticleModel;
