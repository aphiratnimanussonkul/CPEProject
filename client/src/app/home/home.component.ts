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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
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
  }

  code: string;
  faculty: Array<any>;
  major: Array<any>;
  subject: Array<any>;
  select: any = {
    text: ''
  };


  ngOnInit() {
    // this.getUserOnService();
    this.authenService.getUserAndSaveOnsService();
    this.authenService.getLoggedInUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    })
    this.code = '';
    this.refresh();
    this.postService.getFaculty().subscribe(data => {
      this.faculty = data;
    });
  }
  getMajor(facultyName) {
    this.major = null;
    this.postService.getMajor(facultyName).subscribe(data => {
      this.major = data;
    });

  }

  getSubject(majorName) {
    this.subject = null;
    this.postService.getSubject(majorName).subscribe(data => {
      this.subject = data;
    });
  }

  refresh() {
    this.postService.getFacultyTable().subscribe((res) => {
      this.faculty = res;
      this.dataSource = new FacultyDataSource(this.postService);
    });
  }

  search() {
    if (this.code === '') {
      alert('Please enter subject code or subject name');
    } else {
      this.router.navigate(['/searchcourse', this.code]);
      this.code = '';
    }
  }

  follow(code) {
    this.httpClient.get('http://localhost:12345/follow/' + this.authenService.user.email + '/' + code).subscribe(
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

  getfeed(code, name) {
    let status = false;
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
}

export class FacultyDataSource extends DataSource<any> {
  constructor(private postService: PostService) {
    super();
  }

  connect(): Observable<FacultyComponent[]> {
    return this.postService.getFacultyTable();
  }

  disconnect() {
    console.log('disconnect');
  }
}
