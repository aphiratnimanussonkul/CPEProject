import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacultyComponent, Post, Feedback, Comment, Request } from '../mycourse/mycourse.component';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  device: Array<string> = ['iPad', 'iPhone', 'Android'];
  isDesktop: boolean;
  isMobile: boolean;
  constructor(private http: HttpClient, private storage: AngularFireStorage) {
    this.isDesktop = this.isMobile = false;
  }
  subjectFromUser: Array<any>;
  picture: Array<string> = new Array<string>();
  file: Array<string> = new Array<string>();
  isUploadSuccess: boolean;
  isUploading: boolean;
  countDelete: number;
  public API = '//localhost:12345';
  getPost(): Object {
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
    return this.http.post(this.API + '/postPic', formData);
  }
  getFacultyTable(): Observable<FacultyComponent[]> {
    return this.http.get<FacultyComponent[]>(this.API + '/faculties');
  }
  createArticle(post: Post): Observable<Post> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<Post>(this.API + '/post', JSON.stringify(post), { headers });
  }
  getSubjectByCode(code): Observable<any> {
    return this.http.get(this.API + '/subjectbycode/' + code);
  }
  // Get Faculty by Email Get Major by Email and Get Subject by Email
  getFacultyTableByEmail(email): Observable<FacultyComponent[]> {
    return this.http.get<FacultyComponent[]>(this.API + '/facultyemail/' + email);
  }
  getSubjectByEmail(majorName, email): Observable<any> {
    return this.http.get(this.API + '/subjectbyemail/' + majorName + '/' + email);
  }
  getMajorByEmail(facultyName, email): Observable<any> {
    return this.http.get(this.API + '/majorbyemail/' + facultyName + '/' + email);
  }

  getSubjectFromUser(email): Observable<any> {
    return this.http.get(this.API + '/subjectfromuser/' + email);
  }
  getSubjectParseToArray(email) {
    this.getSubjectFromUser(email).subscribe(
      data => {
        this.subjectFromUser = data;
      });
  }
  checkUpload () {
    if (!this.isUploadSuccess) {
      setTimeout(() => {
        this.checkUpload();
      }, 500);
    } else {
      if (this.picture.length > 0) {
        for (let i = 0; i < this.picture.length; i++) {
          let temp = (<string>this.picture[i]).split('/');
          let picname = temp[7].split('?');
          this.storage.ref(picname[0]).delete();
        }
      }
      if (this.file.length > 0) {
        for (let i = 0; i < this.file.length; i++) {
          let temp = (<string>this.file[i]).split('/');
          let filename = temp[7].split('?');
          this.storage.ref(filename[0]).delete();
        }
      }
      this.file.splice(0);
      this.picture.splice(0);
      this.isUploadSuccess = this.isUploading = false;
    }
  }
  createComment(comment: Comment,postID): Observable<Comment> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<Comment>(this.API + '/comment/' + postID, JSON.stringify(comment), {headers});
  }
  createFeedback(feedback: Feedback): Observable<Feedback> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<Feedback>(this.API + '/feedback', JSON.stringify(feedback), { headers });
  }
  createRequest(request: Request): Observable<Request> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:12345');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post<Request>(this.API + '/request', JSON.stringify(request), { headers });
  }
  checkDevice() {
    for (let i = 0; i < this.device.length; i++) {
      if (navigator.userAgent.includes(this.device[i])) {
        this.isMobile = true;
      } else {
        this.isDesktop = true;
      }
    }
  }
}
