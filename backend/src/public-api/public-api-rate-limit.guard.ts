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
		if (!apiKey || Array.isArray(apiKey))
			throw new HttpException("Public API rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS);

		const limit = Number(process.env.PUBLIC_API_RATE_LIMIT ?? 60);
		const now = Date.now();
		const windowMs = 60 * 1000;

		const current = this.hits.get(apiKey);
		if (!current || current.resetAt <= now) {
			this.hits.set(apiKey, {
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
