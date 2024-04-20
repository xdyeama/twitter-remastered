import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';


export interface AuthModel{ 
    jwt_token: string
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn: boolean = false
  jwt_token: string = ""

  constructor(private httpClient: HttpClient) {}

  login(userName: string, password: string): Observable<boolean>{
    console.log(userName)
    console.log(password)
    this.isUserLoggedIn = userName == 'admin' && password == 'admin'
    let jwt_token = ""
    
    return of(this.isUserLoggedIn).pipe(
      delay(1000),
      tap(val => {
        console.log("jwt_token: " + jwt_token);
        }
      )
    )
  }


}
