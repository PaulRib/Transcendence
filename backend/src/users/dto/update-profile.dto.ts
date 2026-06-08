import { IsString, MinLength, MaxLength, IsOptional, IsUrl } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username?: string;

    @IsOptional()
    @IsUrl()
    avatar_url?: string | null;
}