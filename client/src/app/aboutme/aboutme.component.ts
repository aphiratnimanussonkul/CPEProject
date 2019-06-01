import {Component, OnInit} from '@angular/core';
import {AuthenService} from '../service/authen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {PostService} from '../service/post.service';
import set = Reflect.set;

export  interface User {
  name: string;
  picture: string;
  studentId: string;
  email: string;
  major: string;
}
@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.scss']
})
export class AboutmeComponent implements OnInit {

  user: User = {
    name: '',
    picture: '',
    email: '',
    studentId: '',
    major: ''
  }
  constructor(
    private authenService: AuthenService, private route: ActivatedRoute, private router: Router,
    iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private postService: PostService) {
    iconRegistry.addSvgIcon(
      'logout',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
  }

  ngOnInit() {
    this.authenService.getUserAndSaveOnsService();
    this.getUser();
  }
  getUser() {
    if (!this.authenService.user) {
      setTimeout(() => {
        this.getUser();
      }, 50);
    } else {
      this.postService.getUser(this.authenService.user.email).subscribe(user => {
        this.user = user;
        console.log(this.user);
      });
    }
  }
  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  aboutme() {
    this.router.navigate(['/aboutme']);
  }

}
