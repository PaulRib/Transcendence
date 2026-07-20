import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdatePublicChampionDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	gender?: string;

	@IsOptional()
	@IsString()
	position?: string;

	@IsOptional()
	@IsString()
	species?: string;

	@IsOptional()
	@IsString()
	resource_type?: string;

	@IsOptional()
	@IsString()
	range_type?: string;

	@IsOptional()
	@IsString()
	region?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	release_year?: number;
}
