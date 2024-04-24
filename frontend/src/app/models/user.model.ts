export interface User {

    id: number,
    username: string,
    email: string,
    profile: {
        name: string,
        pfp: string,
        banner: string,
        bio: string
    }

}

export interface FollowersList {
    followed: User[],
    followers: User[]

}