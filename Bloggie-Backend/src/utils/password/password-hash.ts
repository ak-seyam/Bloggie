export default interface PasswordHash {
  hash(plainText: string): Promise<string>;
  validate(plainText: string, hashedText: string): Promise<boolean>;
}
