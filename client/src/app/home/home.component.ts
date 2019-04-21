import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PostService } from '../service/post.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
export interface FacultyComponent {
    name: string;
    // newRoomStatusEntity: {
    //   roomStatusName: String;
    // }
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
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
    link: any = {
        name: 'adsdsds/ddddsdsds'
      };
    // FileUpload
    isDocument: boolean;
    isPicture: boolean;
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    uploadProgress: Observable<number>;
    downloadURL: Observable<string>;
    uploadState: Observable<string>;
    //
    nameSubject: string;
    codeSubject: string;
    faculty: Array<any>;
    major: Array<any>;
    subject: Array<any>;
    post: Array<any>;
    user: Array<any>;
    select: any = {
        text: '',
        email: '',
        vdoLink: '',
        getURL: ''
    };
    postVariable: any = {
        _id: 'wwweew',
        name: 'hello'
        // text: 'hello 12345',
        // vdolink: 'gWuTMYThfwE',
        // img: 'https://firebasestorage.googleapis.com/v0/b/cpeproject.appspot.com/o/2GB.png?' +
        //     'alt=media&token=77950445-251e-4cc9-b7d7-159b4153ec12'
    };
    ngOnInit() {
        this.refresh();
        this.postService.getPost().subscribe(data => {
            this.post = data;
            console.log(this.post);
        });
        this.postService.getUser('B5923151@gmail.com').subscribe(data => {
            this.user = data;
            this.select.email = data.email;
            console.log(this.user);
        });
        this.postService.getFaculty().subscribe(data => {
            this.faculty = data;
            console.log(this.faculty);
        });

    }
    test() {
        if (this.select.vdoLink === '') {
            let header = new HttpHeaders();
            header.set('content-type', 'application/json');
            console.log(this.select.text);
            this.postService.addPost(this.select.text, this.select.email, this.codeSubject, this.select).subscribe(
                data => {
                    console.log(data);
                    if (data) {
                        alert('somthing was wrong');
                    } else {
                        alert('post success');
                        this.getFeed(this.codeSubject);
                    }
                    this.select.text = '';
                },
                error => {
                    alert('Error post');
                }
            );
            // this.httpClient.post('http://localhost:12345/post/' + this.select.text + '/'
            //     + this.select.email + '/'
            //     + this.codeSubject,  this.select)
            //     .subscribe(
            //         data => {
            //             console.log(data);
            //             if (data) {
            //                 alert('somthing was wrong');
            //             } else {
            //                 alert('post success');
            //                 this.getFeed(this.codeSubject);
            //             }
            //             this.select.text = '';
            //         },
            //         error => {
            //             alert('Error post');
            //         }
            //     );
        } else {
            if (this.select.vdoLink.includes('youtube'), this.select.vdoLink.length) {
                console.log(this.select.text);
                let temp = this.select.vdoLink.split('=');
                this.select.vdoLink = temp[1];
                if (this.select.vdoLink.endsWith('&list', this.select.vdoLink.length)) {
                    let temp = this.select.vdoLink.split('&');
                    this.select.vdoLink = temp[0];
                }
                alert(this.select.vdoLink)
                this.httpClient.get('http://localhost:12345/post/' + this.select.text + '/'
                    + this.select.email + '/'
                    + this.codeSubject + '/'
                    + this.select.vdoLink, this.select)
                    .subscribe(
                        data => {
                            console.log(data);
                            if (data) {
                                alert('somthing was wrong');
                            } else {
                                alert('post success');
                                this.getFeed(this.codeSubject);
                            }
                            this.select.text = '';
                            this.select.vdoLink = '';
                        },
                        error => {
                            alert('Error post');
                        }
                    );
            } else {
                alert('Please check your youtube link');
                this.select.vdoLink = '';
                this.select.text = '';
            }
        }
    }

    getMajor(facultyName) {
        this.major = null;
        this.postService.getMajor(facultyName).subscribe(data => {
            this.major = data;
            console.log(this.major);
        });

    }

    getSubject(majorName) {
        this.subject = null;
        this.postService.getSubject(majorName).subscribe(data => {
            this.subject = data;
            console.log(this.subject);
        });
    }

    getFeed(code) {
        this.postService.getFeed(code).subscribe(data => {
            this.post = data;
            this.nameSubject = data[0].subject.name;
            this.codeSubject = data[0].subject.code;
            console.log(this.post);
        });
    }
    getEmbedUrl(link) {
        console.log(link);
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + link);
    }

    isComment(posts) {
        posts.comment = true;
    }

    notComment(posts) {
        posts.comment = false;
    }

    upload(event) {
        const file = event.target.files[0];
        const filePath = file.name;
        this.ref = this.storage.ref(filePath);
        this.task = this.ref.put(file);
        this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
        this.uploadProgress = this.task.percentageChanges();
        this.downloadURL = this.ref.getDownloadURL();

    }

    URL(url) {
        if (!url) {
            alert('Can not upload file, please try again');
        }
        this.select.getURL = url;
        if (this.select.getURL.includes('pdf', 0) |
            this.select.getURL.includes('doc', 0) |
            this.select.getURL.includes('docx', 0)) {
            this.isDocument = true;
            this.isPicture = false;
        } else {
            this.isPicture = true;
            this.isDocument = false;
        }
        console.log(this.select.getURL);
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
