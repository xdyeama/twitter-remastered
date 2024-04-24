import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class TokenService{

  constructor() { }

  getDecodedAccessToken(token: string): any {
  try {
    return jwt_decode.jwtDecode(token);
  
  } catch(Error) {
    return null;
  }
}
}
