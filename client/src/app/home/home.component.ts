import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';

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
                private sanitizer: DomSanitizer, private storage: AngularFireStorage) {
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

    faculty: Array<any>;
    major: Array<any>;
    subject: Array<any>;
    post: Array<any>;
    user: Array<any>;
    select: any = {
        text: ''
    };


    ngOnInit() {
        this.refresh();
        this.postService.getPost().subscribe(data => {
            this.post = data;
        });
        this.postService.getUser('B5923151@gmail.com').subscribe(data => {
            this.user = data;
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
