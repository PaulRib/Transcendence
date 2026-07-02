export type PublicUser = {
    id: string;
    username: string;
    avatar_url: string | null;
    elo_rating: number;
    ranked_wins: number;
}