import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public API = '//localhost:12345';
  constructor(private http: HttpClient) { }

  getPost(): Observable<any> {
    return this.http.get(this.API + '/posts');
  }

  getUser(email): Observable<any> {
    return this.http.get(this.API + '/user/' + email);
  }
  // getRoom(memberUserName):Observable<AddRoomComponent[]>{
  //   console.log(memberUserName);
  //   this.name = memberUserName;
  //   console.log(this.name)
  //   return this.http.get<AddRoomComponent[]>(this.API + '/rooms/'+ this.name);
  // }
}
