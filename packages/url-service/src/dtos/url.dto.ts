import { IsString, IsNotEmpty, IsUrl } from "class-validator";

export class ShortenUrlDto {
  @IsString()
  @IsNotEmpty({ message: "Original URL is required" })
  @IsUrl({}, { message: "Invalid URL format" })
  originalUrl!: string;
}

export class UpdateUrlDto {
  @IsString()
  @IsNotEmpty({ message: "Original URL is required" })
  @IsUrl({}, { message: "Invalid URL format" })
  originalUrl!: string;
}
