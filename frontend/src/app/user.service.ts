import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FollowersList, User } from './user.model';
import { Tweet } from './tweet.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private client: HttpClient) {
    }

    getUser(username: string): Observable<User> {

        return this.client.get<User>(`http://127.0.0.1:8000/api/users/${username}`);
    }

    getFollowers(username: string): Observable<FollowersList> {

        return this.client.get<FollowersList>(`http://127.0.0.1:8000/api/users/${username}/follows/`);
    }

    getTweets(username: string): Observable<Tweet[]> {
        return this.client.get<Tweet[]>(`http://127.0.0.1:8000/api/users/${username}/tweets`);
    }




}