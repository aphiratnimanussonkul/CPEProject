import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../admin-page/admin-page.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }
  public API = '//localhost:12345';
  getFacultyTable(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.API + '/faculties');
  }
}
