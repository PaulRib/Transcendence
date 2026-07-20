import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePublicChampionDto } from "./dto/create-public-champion.dto";
import { UpdatePublicChampionDto } from "./dto/update-public-champion.dto";

@Injectable()
export class PublicApiService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly publicChampionSelect = {
		id: true,
		name: true,
		gender: true,
		position: true,
		species: true,
		resource_type: true,
		range_type: true,
		region: true,
		release_year: true,
	} as const;

	async getChampions() {
		return this.prisma.champion.findMany({
			select: this.publicChampionSelect,
			orderBy: { name: "asc" },
		});
	}

	async getChampionById(id: string) {
		const champion = await this.prisma.champion.findUnique({
			where: { id },
			select: this.publicChampionSelect,
		});

		if (!champion)
			throw new NotFoundException(`Champion with id "${id}" not found`);

		return champion;
	}

	async createChampion(createPublicChampionDto: CreatePublicChampionDto) {
		const existingChampion = await this.prisma.champion.findUnique({
			where: { name: createPublicChampionDto.name },
			select: { id: true },
		});

		if (existingChampion)
			throw new ConflictException("Champion already exists");

		return this.prisma.champion.create({
			data: createPublicChampionDto,
			select: this.publicChampionSelect,
		});
	}

	async updateChampion(id: string, updatePublicChampionDto: UpdatePublicChampionDto) {
		await this.getChampionById(id);

		if (updatePublicChampionDto.name) {
			const existingChampion = await this.prisma.champion.findUnique({
				where: { name: updatePublicChampionDto.name },
				select: { id: true },
			});
		
			if (existingChampion && existingChampion.id !== id)
				throw new ConflictException("Champion already exists");
		}

		return this.prisma.champion.update({
			where: { id },
			data: updatePublicChampionDto,
			select: this.publicChampionSelect,
		});
	}

	async deleteChampion(id: string) {
		await this.getChampionById(id);

		await this.prisma.champion.delete({
			where: { id },
		});

		return { message: "Champion deleted successfully" };
	}
}
