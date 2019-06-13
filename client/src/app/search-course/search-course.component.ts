import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {Observable} from 'rxjs/Observable';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenService} from '../service/authen.service';

export interface FacultyComponent {
  name: string;
}


@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SearchCourseComponent implements OnInit {
  // table
  dataSource = new FacultyDataSource(this.postService);
  columnsToDisplay = ['สำนักวิชา'];

  //
  constructor(private postService: PostService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router,
              private authenService: AuthenService) {
    iconRegistry.addSvgIcon(
      'more',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
    iconRegistry.addSvgIcon(
      'hamIcon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
    iconRegistry.addSvgIcon(
      'logout',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
    this.code = this.route.snapshot.paramMap.get('code');
  }

  // Firebase Authen
  user: firebase.User;
  //
  code: string;
  inputCode: string;
  faculty: Array<any>;
  major: Array<any>;
  subject: Array<any>;
  post: Array<any>;

  ngOnInit() {
    this.inputCode = this.code;
    this.authenService.getUserAndSaveOnsService();
    this.authenService.getLoggedInUser().subscribe(
      user => {
        if (!user.email) {
          this.router.navigate(['/login']);
        }
      });
    this.search();
    if (!this.authenService.user.email) {
      setTimeout(() => {
        this.getSubjectFromUser();
      }, 50);
    } else {
      this.postService.getSubjectParseToArray(this.authenService.user.email);
    }
  }

  getSubjectFromUser() {
    if (this.authenService.user.email === '') {
      setTimeout(() => {
        this.getSubjectFromUser();
      }, 50);
    } else {
      this.postService.getSubjectParseToArray(this.authenService.user.email);
    }
  }

  search() {
    if (this.inputCode === '') {
      alert('Please enter subject code or subject name');
    } else {
      this.router.navigate(['/searchcourse', this.inputCode]);
      this.postService.getSubjectByCode(this.inputCode).subscribe(
        data => {
          if (!data) {
            this.inputCode = '';
            alert('Can not find any subject. Please  check your code or Subject name');
          }
          this.subject = data;
        }
      );
    }
  }

  getfeed(code, name) {
    let status = false;
    console.log(this.postService.subjectFromUser);
    if (this.postService.subjectFromUser !== null) {
      for (let i = 0; i < this.postService.subjectFromUser.length; i++) {
        if (this.postService.subjectFromUser[i].code === code) {
          status = true;
        }
      }
      if (status) {
        this.router.navigate(['/mycourse', code, name]);
      } else {
        alert('Please follow this course');
      }
    } else {
      alert('Please follow this course');
    }
  }

  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }

  follow(code) {
    this.httpClient.get(this.postService.API + '/follow/' + this.authenService.user.email + '/' + code).subscribe(
      data => {
        if (!data) {
          alert('Follow success');
          this.postService.getSubjectParseToArray(this.authenService.user.email);
        } else {
          alert('You have followed this course');
        }
      },
      error => {
      }
    );
  }
}

export class FacultyDataSource extends DataSource<any> {
  constructor(private postService: PostService) {
    super();
    //   this.name = this.memberUserName;
  }

  connect(): Observable<FacultyComponent[]> {
    return this.postService.getFacultyTable();
  }

  disconnect() {
    console.log('disconnect');
  }
}
