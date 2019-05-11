import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty, Major, Subject } from '../admin-page/admin-page.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }
  public API = '//localhost:12345';
  getFacultyTable(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.API + '/faculties');
  }
  getFaculty(): Observable<any> {
    return this.http.get(this.API + '/faculties');
  }
  getMajorTable(): Observable<Major[]> {
    return this.http.get<Major[]>(this.API + '/majors');
  }
  getMajor(): Observable<any> {
    return this.http.get(this.API + '/majors');
  }
  getSubjectTable(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.API + '/subjects');
  }
  getMajorFaculty(facultyName): Observable<any> {
    return this.http.get(this.API + '/major/' + facultyName);
  }
}
