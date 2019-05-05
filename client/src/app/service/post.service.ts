import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FacultyComponent, Post} from '../mycourse/mycourse.component';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public API = '//localhost:12345';
  constructor(private http: HttpClient) {}

  getPost(): Observable<any> {
    return this.http.get(this.API + '/posts');
  }

  getUser(email): Observable<any> {
    return this.http.get(this.API + '/user/' + email);
  }
  getFaculty(): Observable<any> {
    return this.http.get(this.API + '/faculties');
  }
  getChips(): Observable<any> {
    return this.http.get(this.API + '/chips');
  }
  getSubjects(): Observable<any> {
    return this.http.get(this.API + '/subjects');
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
  createArticle(post: Post): Observable<Post> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<Post>(this.API + '/post', JSON.stringify(post), {headers});
  }
  getSubjectByCode(code): Observable<any> {
    return this.http.get(this.API + '/subjectbycode/' + code);
  }
  getFacultyTableByEmail(email): Observable <FacultyComponent[]> {
    return this.http.get<FacultyComponent[]>(this.API + '/facultyemail/' + email);
  }
}
