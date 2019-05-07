import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { Observable } from 'rxjs/Observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from '../service/authen.service';

export interface FacultyComponent {
    name: string;
}


@Component({
    selector: 'app-search-course',
    templateUrl: './search-course.component.html',
    styleUrls: ['./search-course.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
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
    users: any = {
        name: '',
        email: '',
        displayName: ''
    };
    select: any = {
        text: ''
    };
    ngOnInit() {
        this.inputCode = '';
        this.authenService.getLoggedInUser().subscribe(
            user => {
                console.log(user);
                this.user = user;
                this.users.email = user.email;
                if (user.displayName !== null) {
                    this.users.displayName = user.displayName;
                } else {
                    this.users.displayName = user.email;
                }
            });
        this.postService.getSubjectByCode(this.code).subscribe(
            data => {
                this.subject = data;
                
            }
        )

    }
    search() {
        if (this.inputCode === '') {
            alert('Please enter subject code or subject name');
        } else {
            this.postService.getSubjectByCode(this.inputCode).subscribe(
                data => {
                    this.subject = data;
                    this.inputCode = '';
                    console.log(data);
                }
            )
        }
    }
    getfeed(code, name) {
        this.router.navigate(['/mycourse', code, name]);
    }
    logout() {
        this.router.navigate(['/login']);
        this.authenService.logout();
    }
    follow() {
        this.httpClient.get('http://localhost:12345/follow/' + this.users.email + '/' + this.code).subscribe(
            data => {
                if (!data) {
                    alert('Follow success');
                } else {
                    alert('You have followed this course');
                }
            },
            error => { }
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
