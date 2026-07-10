import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

type RateLimitEntry = {
	count: number;
	resetAt: number;
};

@Injectable()
export class PublicApiRateLimitGuard implements CanActivate {
	private readonly hits = new Map<string, RateLimitEntry>();

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();

		const apiKey = request.headers["x-api-key"];
		const identifier = Array.isArray(apiKey) ? apiKey[0] : apiKey ?? request.ip ?? "anonymous";

		const limit = Number(process.env.PUBLIC_API_RATE_LIMIT ?? 60);
		const now = Date.now();
		const windowMs = 60 * 1000;

		const current = this.hits.get(identifier);
		if (!current || current.resetAt <= now) {
			this.hits.set(identifier, {
				count: 1,
				resetAt: now + windowMs,
			});
			return true;
		}

		if (current.count >= limit)
			throw new HttpException("Public API rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS);

		current.count += 1;
		return true;
	}
}