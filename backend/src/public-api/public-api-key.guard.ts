import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PUBLIC_API_PERMISSION_KEY, PublicApiPermissionType } from "./public-api-permission.decorator";

@Injectable()
export class PublicApiKeyGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const requiredPermission = this.reflector.get<PublicApiPermissionType>(
			PUBLIC_API_PERMISSION_KEY,
			context.getHandler(),
		) ?? "read";

		const apiKey = request.headers["x-api-key"];
		const readApiKey = process.env.PUBLIC_API_READ_KEY;
		const writeApiKey = process.env.PUBLIC_API_WRITE_KEY;

		if (!apiKey || Array.isArray(apiKey))
			throw new UnauthorizedException("Invalid public API key");

		if (requiredPermission === "write") {
			if (!writeApiKey || apiKey !== writeApiKey)
				throw new UnauthorizedException("Missing public API write permission");
			return true;
		}

		if ((!readApiKey || apiKey !== readApiKey) && (!writeApiKey || apiKey !== writeApiKey))
			throw new UnauthorizedException("Invalid public API key");
		
		return true;
	}
}