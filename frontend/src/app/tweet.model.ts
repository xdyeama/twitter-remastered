import { User } from "./user.model";

export interface Tweet {
    id: number,
    user_id: number,
    user: User,
    content: string,
    created_at: string,
    comments_count: number,
    likes_count: number
}
export interface Comment {
    id: number,
    tweet_id: number,
    user_id: number,
    user: User,
    content: string,
    created_at: string
}
export interface Like {
    id: number,
    user: User
}