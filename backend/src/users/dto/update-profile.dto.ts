import { IsString, MinLength, MaxLength, IsOptional, IsUrl } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string | null;
}