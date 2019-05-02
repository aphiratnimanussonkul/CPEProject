import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {Observable} from 'rxjs/Observable';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
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
                private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
        iconRegistry.addSvgIcon(
            'more',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
        iconRegistry.addSvgIcon(
            'hamIcon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
        iconRegistry.addSvgIcon(
            'logout',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
        this.email = this.route.snapshot.paramMap.get('email');
    }
    code: string;
    faculty: Array<any>;
    major: Array<any>;
    subject: Array<any>;
    post: Array<any>;
    user: any = {
        firstname: '',
        lastname: ''
    };
    select: any = {
        text: ''
    };
    email: string;
    ngOnInit() {
        this.code = '';
        this.refresh();
        this.postService.getPost().subscribe(data => {
            this.post = data;
        });
        this.postService.getUser(this.email).subscribe(data => {
            this.user.firstname = data.firstname;
            this.user.lastname = data.lastname;
        });
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
            this.router.navigate(['/search', this.code]);
        }
    }
    follow(code) {
        this.httpClient.get('http://localhost:12345/follow/' + this.email + '/' + code).subscribe(
            data => {
                if (!data) {
                    alert('Follow success');
                } else {
                    alert('You have followed this course');
                }
            },
            error => {}
        );
    }
    getfeed(code) {
        this.router.navigate(['/mycourse', this.email, code]);
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
