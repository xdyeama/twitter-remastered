import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tweet, Comment, Like } from '../models/tweet.model';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class TweetService {

    constructor(private client: HttpClient) {
    }


    postTweet(userID: string, content: string): Observable<Tweet>{
        let body = { 
            "user_id": userID,
            "content": content
        }
        return this.client.post<Tweet>(`http://127.0.0.1:8000/api/tweets/`, body)
    }
    getTweets(): Observable<Tweet[]> {
        return this.client.get<Tweet[]>(`http://127.0.0.1:8000/api/tweets/`);
    }

    getTweet(id: number): Observable<Tweet> {

        return this.client.get<Tweet>(`http://127.0.0.1:8000/api/tweets/${id}/`);
    }
    getComments(id: number): Observable<Comment[]> {

        return this.client.get<Comment[]>(`http://127.0.0.1:8000/api/tweets/${id}/comments/`);
    }
    sendComment(id: number, content: string) {
        const body = JSON.stringify({ content: content });
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.client.post(`http://127.0.0.1:8000/api/tweets/${id}/comments/`, body, { headers });
    }
    deleteTweet(id: number) {
        return this.client.delete(`http://127.0.0.1:8000/api/tweets/${id}/`);
    }
    getLikes(id: number): Observable<Like[]> {

        return this.client.get<Like[]>(`http://127.0.0.1:8000/api/tweets/${id}/like/`);
    }
    like(id: number) {
        return this.client.post(`http://127.0.0.1:8000/api/tweets/${id}/like/`, {});
    }
    dislike(id: number) {
        return this.client.delete(`http://127.0.0.1:8000/api/tweets/${id}/like/`);
    }
    deleteComment(id: number) {
        return this.client.delete(`http://127.0.0.1:8000/api/comments/${id}/`)
    }

}

