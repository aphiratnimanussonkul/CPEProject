import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../service/authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import {PostService} from "../service/post.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: firebase.User;

  constructor(
    private service: AuthenService, private route: ActivatedRoute, private router: Router,
    private postService: PostService) { }
  ngOnInit() {
    this.postService.checkDevice();
    console.log(this.postService.isMobile);
    this.service.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
        this.postService.getUser(user.email).subscribe(
          data => {
            if (data) {
              this.service.getUserAndSaveOnsService();
              this.router.navigate(['/welcome']);
            }
          }
        );
      });
  }

  LoginWithGoogle() {
    console.log('Login...Google');
    this.service.logingoogle();
    this.router.navigate(['/profile']);
  }

  LoginWithFacebook() {
    console.log('Login...Facebook');
    this.service.loginfacebook();
    this.router.navigate(['/profile']);
  }

  LoginWithGithub() {
    console.log('Login...Github');
    this.service.logingithub();
    this.router.navigate(['/profile']);
  }

  LoginWithTwitter() {
    console.log('Login...Twitter');
    this.service.logintwitter();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.service.logout();
  }

}
