import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../profile/profile.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // public API = 'http://localhost:12345';
  public API = 'https://sutcpe.club/goservice';
  constructor(private http: HttpClient) {
  }
  createUser (users: User): Observable<User> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', this.API);
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<User>(this.API + '/createuser', JSON.stringify(users), {headers});
  }
}
