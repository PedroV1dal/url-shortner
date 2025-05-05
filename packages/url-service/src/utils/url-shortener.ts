import { customAlphabet } from "nanoid";

const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 6);

export function generateShortCode(): string {
  return nanoid();
}
