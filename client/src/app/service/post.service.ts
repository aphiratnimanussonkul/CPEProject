import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FacultyComponent } from '../home/home.component';

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
  getFaculty(): Observable<any> {
    return this.http.get(this.API + '/faculties');
  }
  getMajor(facultyName): Observable<any> {
    return this.http.get(this.API + '/major/' + facultyName);
  }
  getSubject(majorName): Observable<any> {
    return this.http.get(this.API + '/subject/' + majorName);
  }
  getFeed(code): Observable<any> {
    return this.http.get(this.API + '/post/' + code);
  }

  upload(formData) {
    return this.http.post(this.API + '/postPic' , formData);
  }
  getFacultyTable(): Observable <FacultyComponent[]> {
    return this.http.get<FacultyComponent[]>(this.API + '/faculties');
  }
}
