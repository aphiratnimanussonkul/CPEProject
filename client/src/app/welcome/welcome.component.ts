import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../service/authen.service';
import { PostService } from '../service/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FacultyDataSource} from "../mycourse/mycourse.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private authenService: AuthenService, private  postService: PostService,
              private route: ActivatedRoute, private router: Router,
              private httpClient: HttpClient) { }

  email: string;
  ngOnInit() {
    this.authenService.getUserAndSaveOnsService();
    this.email = this.authenService.user.email;
    this.getSubject();

  }
  getSubject () {
    if (this.email === null) {
      setTimeout(() => {
        this.getSubject();
      }, 50);
    } else {
      this.postService.getSubjectParseToArray(this.authenService.user.email);
      console.log(this.postService.subjectFromUser);
    }
  }
  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }
  getFeed(code, name) {
    this.router.navigate(['/mycourse', code, name]);
  }
  unfollow(code) {
    this.httpClient.get('http://localhost:12345/unfollow/' + this.authenService.user.email + '/' + code).subscribe(
      data => {
        if (!data) {
          alert('Unfollow success');
          this.postService.getSubjectParseToArray(this.authenService.user.email);
        }
      },
      error => {
      }
    );
  }
}
