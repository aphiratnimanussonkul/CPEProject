import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../profile/profile.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public API = '//localhost:12345';
  constructor(private http: HttpClient) {
  }
  createUser (users: User): Observable<User> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<User>(this.API + '/createuser', JSON.stringify(users), {headers});
  }
}
