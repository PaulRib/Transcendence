export type PublicUser = {
    id: string;
    username: string;
    avatar_url: string | null;
    elo_rating: number;
    ranked_wins: number;
    ranked_losses: number;
    // --- [AJOUT 2FA] --- Indique au frontend si la 2FA est active sur le compte
    is_two_factor_enabled?: boolean;
}