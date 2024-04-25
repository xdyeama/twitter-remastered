import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http'



export type pfpResponse = {
  name: string, 
  pfp: string, 
  banner: string, 
  bio: string
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public uploadImage(username: string, image: File): Observable<HttpResponse<any>> {
    const formData = new FormData();

    formData.append('image', image);
    return this.http.patch(`/api/users/${username}/pfp`, formData, { observe: 'response' });
  }
}