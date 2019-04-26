import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { observable } from 'rxjs';

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
    vdolink: string[];
    file: string[];
    subject: {
        name: string;
        code: string;
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

    // upload vdo many
    count: number;
    tempVdoLink: string[] = ['', '', '', '', '', '', '', '', '', ''];
    tempVdoLink2: string[] = ['', '', '', '', '', '', '', '', '', ''];
    isAddVdo: boolean;
    // upload file many
    countFile: number;
    tempFileLink: string[] = ['', '', '', '', '', '', '', '', '', ''];
    tempFileLink2: string[] = ['', '', '', '', '', '', '', '', '', ''];
    isFile: boolean;
    // FileUpload
    isDocument: boolean;
    isPicture: boolean;
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    uploadProgress: Observable<number>[] = [null, null, null, null, null, null, null, null, null, null];
    downloadURL: Observable<string>[] = [null, null, null, null, null, null, null, null, null, null];
    uploadState: Observable<string>[] = [null, null, null, null, null, null, null, null, null, null];
    getURL: string[] = ['', '', '', '', '', '', '', '', '', ''];
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
        sendURLName: '',
        sendURLToken: ''
    };
    posts: Post = {
        text: '',
        user: {
            firstname: '',
            lastname: '',
            email: ''
        },
        vdolink: ['', '', '', '', '', '', '', '', '', ''],
        file: ['', '', '', '', '', '', '', '', '', ''],
        subject : {
            name: '',
            code: ''
        }
    };
    ngOnInit() {
        this.isFile = true;
        this.isAddVdo = true;
        this.count = 0;
        this.countFile = 0;
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
        if (this.select.sendURLName === '' && this.select.vdoLink === '') {
            this.posts.text = this.select.text;
            this.posts.file = this.getURL;
            this.posts.vdolink = this.tempVdoLink;
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
            this.posts.subject.code = this.codeSubject;
            this.posts.subject.name = this.nameSubject;
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

    upload(event, index) {
        const file = event.target.files[0];
        const filePath = file.name;
        this.ref = this.storage.ref(filePath);
        this.task = this.ref.put(file);
        this.uploadState[index] = this.task.snapshotChanges().pipe(map(s => s.state));
        this.uploadProgress[index] = this.task.percentageChanges();
        this.downloadURL[index] = this.ref.getDownloadURL();
    }

    URL(url, index) {
        this.getURL[index] = url;
        if (this.getURL[index].includes('pdf', 0) ||
            this.getURL[index].includes('doc', 0) ||
            this.getURL[index].includes('docx', 0)) {
            this.isDocument = true;
            this.isPicture = false;
        } else {
            this.isPicture = true;
            this.isDocument = false;
        }
        if (this.getURL[index] === null) {
            alert('Can not upload file, please try again');
        }
    }

    refresh() {
        this.postService.getFacultyTable().subscribe((res) => {
            this.faculty = res;
            this.dataSource = new FacultyDataSource(this.postService);
        });
    }

    checkLink(link) {
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

    isAddFunc() {
        if (this.tempVdoLink.length === this.count) {
            alert('Limited video at 10 link');
        } else {
            if (this.isAddVdo === true) {
                this.tempVdoLink2[this.count] = '1';
                this.count += 1;
                console.log(this.tempVdoLink);
                console.log(this.count);
            } else if (this.isAddVdo === false) {
                for (let i = 0; i <= this.count; i++) {
                    this.tempVdoLink[i] = '';
                    this.tempVdoLink2[i] = '';
                }
                this.count = 0;
            }
        }
    }

    isClear() {
        this.tempVdoLink2[this.count] = '';
        this.tempVdoLink[this.count] = '';
        this.count -= 1;
    }

    testVdo() {
        console.log(this.tempVdoLink);
        console.log(this.tempVdoLink2);
        this.posts.file = this.getURL;
        console.log(this.posts);
        console.log(this.getURL)
    }

    // file
    isFileFunc() {
        if (this.tempFileLink.length === this.countFile) {
            alert('Limited files at 10 file');
        } else {
            if (this.isFile === true) {
                this.tempFileLink2[this.countFile] = '1';
                this.countFile += 1;
            } else if (this.isFile === false) {
                for (let i = 0; i <= this.countFile; i++) {
                    this.tempFileLink[i] = '';
                    this.tempFileLink2[i] = '';
                }
                this.countFile = 0;
            }
        }
    }

    isFileClear() {
        this.tempFileLink[this.countFile] = '';
        this.tempFileLink2[this.countFile] = '';
        this.countFile -= 1;
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
