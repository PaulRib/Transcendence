export type PublicUser = {
    id: string;
    username: string;
    avatar_url: string | null;
    elo_rating: number;
    ranked_wins: number;
    ranked_losses: number;
    is_two_factor_enabled?: boolean;
}
