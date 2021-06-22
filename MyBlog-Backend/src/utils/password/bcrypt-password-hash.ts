import PasswordHash from "./password-hash";
import { hash, compare } from "bcrypt";

export default class BcryptPasswordHash implements PasswordHash {
  hash(plainText: string): Promise<string> {
    return hash(plainText, 10);
  }
  validate(plainText: string, hashedText: string): Promise<boolean> {
    return compare(plainText, hashedText);
  }
}
