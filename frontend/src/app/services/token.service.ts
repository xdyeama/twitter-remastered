import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class TokenService{

  constructor() { }

  getDecodedAccessToken(token: string): any {
  try {
    console.log("access token " + token)
    return jwtDecode<JwtPayload>(token);
  
  } catch(Error) {
    console.log(Error);
  }
}
}
