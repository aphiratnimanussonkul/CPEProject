import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthenService } from '../service/authen.service';
import { PostService } from '../service/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FacultyDataSource} from '../mycourse/mycourse.component';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;
  constructor(private authenService: AuthenService, private  postService: PostService,
              private route: ActivatedRoute, private router: Router, iconRegistry: MatIconRegistry,
              private httpClient: HttpClient, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'more',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
    iconRegistry.addSvgIcon(
      'hamIcon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
    iconRegistry.addSvgIcon(
      'logout',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
  }

  email: string;
  ngOnInit() {
    this.getUser();
    this.email = this.authenService.user.email;
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }
  getUser() {
    this.authenService.getUserAndSaveOnsService();
    if (!this.authenService.check) {
      setTimeout(() => {
        this.getUser();
      }, 100);
    } else {
      this.getSubject();
    }
  }
  getSubject () {
      this.postService.getSubjectParseToArray(this.authenService.user.email);
      setTimeout(() => {
        if (!this.postService.subjectFromUser) {
          this.basicModal.show();
        }
      }, 300);
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
          this.getSubject();
        }
      },
      error => {
      }
    );
  }
  add() {
    this.router.navigate(['/home']);
  }
}
