import { IsInt, IsString, Min } from "class-validator";

export class CreatePublicChampionDto {
	@IsString()
	name!: string;

	@IsString()
	gender!: string;

	@IsString()
	position!: string;

	@IsString()
	species!: string;

	@IsString()
	resource_type!: string;

	@IsString()
	range_type!: string;

	@IsString()
	region!: string;

	@IsInt()
	@Min(0)
	release_year!: number;
}