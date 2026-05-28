import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const [type, token] = authorization?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) { // Bearer = je presente un token d acces (souvent JWT)
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload; // Ajoute le payload verifie a la requete. Comme c est le meme objet request qui continue vers le controller, celui ci pourra lire request.user
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}