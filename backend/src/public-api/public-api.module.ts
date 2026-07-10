import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PublicApiController } from "./public-api.controller";
import { PublicApiKeyGuard } from "./public-api-key.guard";
import { PublicApiRateLimitGuard } from "./public-api-rate-limit.guard";
import { PublicApiService } from "./public-api.service";

@Module({
	imports: [PrismaModule],
	controllers: [PublicApiController],
	providers: [PublicApiService, PublicApiKeyGuard, PublicApiRateLimitGuard],
})
export class PublicApiModule {}