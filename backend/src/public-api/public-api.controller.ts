import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreatePublicChampionDto } from "./dto/create-public-champion.dto";
import { UpdatePublicChampionDto } from "./dto/update-public-champion.dto";
import { PublicApiKeyGuard } from "./public-api-key.guard";
import { PublicApiPermission } from "./public-api-permission.decorator";
import { PublicApiRateLimitGuard } from "./public-api-rate-limit.guard";
import { PublicApiService } from "./public-api.service";

@Controller("public/champions")
@UseGuards(PublicApiKeyGuard, PublicApiRateLimitGuard)
export class PublicApiController {
	constructor(private readonly publicApiService: PublicApiService) {}

	@Get()
	getChampions() {
		return this.publicApiService.getChampions();
	}

	@Get(":id")
	getChampionById(@Param("id") id: string) {
		if (!id || typeof id !== "string")
			throw new BadRequestException("Invalid champion id");

		return this.publicApiService.getChampionById(id);
	}

	@Post()
	@PublicApiPermission("write")
	createChampion(@Body() createPublicChampionDto: CreatePublicChampionDto) {
		return this.publicApiService.createChampion(createPublicChampionDto);
	}

	@Put(":id")
	@PublicApiPermission("write")
	updateChampion(@Param("id") id:string, @Body() updatePublicChampionDto: UpdatePublicChampionDto) {
		if (!id || typeof id !== "string")
			throw new BadRequestException("Invalid champion id");

		return this.publicApiService.updateChampion(id, updatePublicChampionDto);
	}

	@Delete(":id")
	@PublicApiPermission("write")
	deleteChampion(@Param("id") id: string) {
		if (!id || typeof id !== "string")
			throw new BadRequestException("Invalid champion id");

		return this.publicApiService.deleteChampion(id);
	}
}
