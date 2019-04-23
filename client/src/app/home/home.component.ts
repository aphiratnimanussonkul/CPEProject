import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PostService } from '../service/post.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';

export interface FacultyComponent {
    name: string;
}
export interface Post {
    text: string;
    user: {
        firstname: string
        lastname: string
        email: string
    };
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
        getURL: '',
        sendURLName: '',
        sendURLToken: ''
    };
    posts: Post = {
        text: '',
        user: {
            firstname: '',
            lastname: '',
            email: ''
        }
    };
    ngOnInit() {
        this.refresh();
        this.postService.getPost().subscribe(data => {
            this.post = data;
        });
        this.postService.getUser('B5923151@gmail.com').subscribe(data => {
            this.user = data;
            this.select.email = data.email;
            this.posts.user.firstname = data.firstname;
            this.posts.user.lastname = data.lastname;
            this.posts.user.email = data.email;
        });
        this.postService.getFaculty().subscribe(data => {
            this.faculty = data;
        });
    }
    test() {
        if (this.select.vdoLink === '' && this.select.vdoLink.includes('youtube'), this.select.vdoLink.length) {
            let temp = this.select.vdoLink.split('=');
            this.select.vdoLink = temp[1];
            if (this.select.vdoLink.endsWith('&list', this.select.vdoLink.length)) {
                let temp = this.select.vdoLink.split('&');
                this.select.vdoLink = temp[0];
            }
        } else {
            alert('Please check your youtube link');
        }
        if (this.select.sendURLName === '' &&  this.select.vdoLink === '') {
            this.posts.text = this.select.text;
             this.postService.createArticle(this.posts).subscribe(
                 data => {
                     let temp = data;
                     console.log(temp);
                 },
                 error1 => {
                 }
             );
            // this.httpClient.post('http://localhost:12345/post/'
            //     + this.select.text + '/'
            //     + this.select.email + '/'
            //     + this.codeSubject,  this.select,)
            //     .subscribe(
            //         data => {
            //             if (data) {
            //                 alert('somthing was wrong');
            //             } else {
            //                 alert('post success');
            //                 this.getFeed(this.codeSubject);
            //             }
            //         },
            //         error => {
            //             alert('Error post');
            //         }
            //     );
        } else if (this.select.vdoLink === '') {
            this.httpClient.get('http://localhost:12345/postfile/'
                + this.select.text + '/'
                + this.select.email + '/'
                + this.codeSubject + '/'
                + this.select.sendURLName + '/'
                + this.select.sendURLToken, this.select)
                .subscribe(
                    data => {
                        if (data) {
                            alert('somthing was wrong');
                        } else {
                            alert('post success');
                            this.getFeed(this.codeSubject);
                        }
                    },
                    error => {
                        alert('Error post');
                    }
                );
        } else if (this.select.sendURLName === '') {
            this.httpClient.get('http://localhost:12345/postvdo/'
                + this.select.text + '/'
                + this.select.email + '/'
                + this.codeSubject + '/'
                + this.select.vdoLink, this.select)
                .subscribe(
                    data => {
                        if (data) {
                            alert('somthing was wrong');
                        } else {
                            alert('post success');
                            this.getFeed(this.codeSubject);
                        }
                    },
                    error => {
                        alert('Error post');
                    }
                );
        } else {
            this.httpClient.get('http://localhost:12345/postfull/'
                + this.select.text + '/'
                + this.select.email + '/'
                + this.codeSubject + '/'
                + this.select.vdoLink + '/'
                + this.select.sendURLName + '/'
                + this.select.sendURLToken, this.select)
                .subscribe(
                    data => {
                        if (data) {
                            alert('somthing was wrong');
                        } else {
                            alert('post success');
                            this.getFeed(this.codeSubject);
                        }
                    },
                    error => {
                        alert('Error post');
                    }
                );
        }
        this.select.sendURLToken = '';
        this.select.sendURLName = '';
        this.select.text = '';
        this.select.vdoLink = '';
        this.select.getURL = '';
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

    getFeed(code) {
        this.postService.getFeed(code).subscribe(data => {
            this.post = data;
            this.nameSubject = data[0].subject.name;
            this.codeSubject = data[0].subject.code;
            console.log(this.post);
        });
    }
    getEmbedUrl(link) {
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
        } else {
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
            let temp = this.select.getURL.split('/');
            let tempLink = temp[7].split('?');
            this.select.sendURLName = tempLink[0];
            this.select.sendURLToken = tempLink[1];
        }
    }
    refresh() {
        this.postService.getFacultyTable().subscribe((res) => {
            this.faculty = res;
            this.dataSource = new FacultyDataSource(this.postService);
        });
    }
    checkLink (link) {
        if (link.file.includes('pdf', 0) |
            link.file.includes('doc', 0) |
            link.file.includes('docx', 0)) {
            link.isLinkDocument = true;
            link.isLinkPic = false;
        } else {
            link.isLinkPic = true;
            link.isLinkDocument = false;
        }
    }
    getFireUrl(link) {
        return 'https://firebasestorage.googleapis.com/v0/b/cpeproject.appspot.com/o/' + link.file;
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
