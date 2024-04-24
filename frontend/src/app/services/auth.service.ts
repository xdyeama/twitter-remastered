import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { AuthModel, UserModel } from '../models/UserModel';


export type JWTResponse = {
    refresh: string
    access: string
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn: boolean = false
  jwt_token: string = ""

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string){
    return this.httpClient.post<JWTResponse>("http://127.0.0.1:8000/api/login", {"username": email, "password": password})

  }

  register(email: string, password: string, name: string, surname: string, image: string | null): Observable<UserModel>{
    return this.httpClient.post<UserModel>("http://127.0.0.1:8000/api/register", {email, password, name, surname, image})
  }


}
