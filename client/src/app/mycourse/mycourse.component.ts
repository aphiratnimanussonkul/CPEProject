import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';

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
    filename: string[];
    picture: string[];
    subject: {
        name: string;
        code: string;
    };
}

@Component({
    selector: 'app-mycourse',
    templateUrl: './mycourse.component.html',
    styleUrls: ['./mycourse.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MycourseComponent implements OnInit {
    // table
    dataSource = new FacultyDataSource(this.postService);
    columnsToDisplay = ['สำนักวิชา'];

    constructor(private postService: PostService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer, private storage: AngularFireStorage, private route: ActivatedRoute,
                private router: Router) {
        iconRegistry.addSvgIcon(
            'more',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
        iconRegistry.addSvgIcon(
            'hamIcon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
        iconRegistry.addSvgIcon(
            'logout',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
        this.posts.user.email = this.route.snapshot.paramMap.get('email');
        this.codeSubject = this.route.snapshot.paramMap.get('code');
    }

    // upload vdo many
    count: number;
    tempVdoLink: string[] = ['', '', '', '', ''];
    tempVdoLink2: string[] = ['', '', '', '', ''];
    isAddVdo: boolean;
    // upload file many
    countFile: number;
    tempFileLink: string[] = ['', '', '', '', ''];
    tempFileLink2: string[] = ['', '', '', '', ''];
    isFile: boolean;
    // Upload Picture Many
    countPic: number;
    tempPicLink: string[] = ['', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', ''];
    tempPicLink2: string[] = ['', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', ''];
    isPic: boolean;
    // FileUpload
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    uploadProgress: Observable<number>[] = [null, null, null, null, null];
    downloadURL: Observable<string>[] = [null, null, null, null, null];
    uploadState: Observable<string>[] = [null, null, null, null, null];
    // Picturee Upload
    uploadProgressPic: Observable<number>[] = [null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null];
    downloadURLPic: Observable<string>[] = [null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null];
    uploadStatePic: Observable<string>[] = [null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null];
    //
    nameSubject: string;
    codeSubject: string;
    faculty: Array<any>;
    major: Array<any>;
    subject: Array<any>;
    post: Array<any>;
    user: Array<any>;
    select: any = {
        text: ''
    };
    posts: Post = {
        text: '',
        user: {
            firstname: '',
            lastname: '',
            email: ''
        },
        vdolink: ['', '', '', '', ''],
        file: [],
        filename: [],
        picture: [],
        subject: {
            name: '',
            code: ''
        }
    };
    // post
    isPost: boolean;
    isUpload: boolean;
    file: Array<File> = new Array<File>(5);
    picture: Array<File> = new Array<File>(30);
    countFileChoose: number;
    countPicChoose: number;
    countFileStatus: number;
    countPicStatus: number;
    ngOnInit() {
        this.countPicChoose = 0;
        this.countFileChoose = 0;
        this.countFileStatus = 0;
        this.countPicStatus = 0;
        this.isUpload = false;
        this.isPost = false;
        this.isFile = true;
        this.isPic = true;
        this.isAddVdo = true;
        this.count = 0;
        this.countFile = 0;
        this.countPic = 0;
        this.refresh();
        this.postService.getSubjectByCode(this.codeSubject).subscribe(data => {
                this.posts.subject.code = this.codeSubject;
                this.posts.subject.name = this.nameSubject;
                this.nameSubject = data;
            }
        );
        this.postService.getFeed(this.codeSubject).subscribe(data => {
            this.post = data;
        });
        this.postService.getUser(this.posts.user.email).subscribe(data => {
            this.user = data;
            this.posts.user.firstname = data.firstname;
            this.posts.user.lastname = data.lastname;
        });
        this.postService.getFaculty().subscribe(data => {
            this.faculty = data;
        });
    }

    UPLOAD() {
        console.log('File');
        this.file.forEach(files => {
            this.ref = this.storage.ref(files.name);
            this.ref.put(files).then((result) => {
                if (result.state !== 'success') {
                    console.log('checkStatus');
                    this.checkFile(result.state);
                } else {
                    this.ref.getDownloadURL().subscribe(
                        data => {
                            console.log('push');
                            this.posts.file.push(data);
                            this.posts.filename.push(files.name);
                            this.countFileStatus += 1;
                            console.log(this.countFileStatus);
                        }
                    );
                }
            });
        });
    }

    UPLOADPIC() {
        console.log('Picture');
        this.picture.forEach(pictures => {
            this.ref = this.storage.ref(pictures.name);
            this.ref.put(pictures).then((result) => {
                if (result.state !== 'success') {
                    console.log('checkStatus');
                    this.checkPicture(result.state);
                } else {
                    this.ref.getDownloadURL().subscribe(
                        data => {
                            console.log('push');
                            this.posts.picture.push(data);
                            this.countPicStatus += 1;
                            console.log(this.countPicStatus);
                        }
                    );
                }
            });
        });
    }

    UPLOADALL() {
        this.posts.text = this.select.text;
        this.posts.vdolink = this.tempVdoLink;
        this.postService.createArticle(this.posts).subscribe(
            data => {
                if (data) {
                    console.log(data);
                    alert(data);
                } else {
                    alert('success');
                    this.getFeed(this.codeSubject, this.nameSubject);
                }
            },
            error1 => {
            }
        );
        this.posts.text = '';
        this.select.text = '';
        this.posts.file = null;
        this.posts.vdolink = null;
        this.posts.picture = null;
        this.file = null;
        this.picture = null;
        console.log('post');
    }

    test() {
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
        if (this.countFileChoose !== 0) {
            this.UPLOAD();
        }
        console.log(this.file[0]);
        if (this.countFileChoose !== 0) {
            this.UPLOADPIC();
        }
        console.log(this.picture);
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
        this.checkSuccess();
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
    }
    checkFile(state) {
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
        if (state !== 'success') {
            setTimeout(this.checkFile, 5000);
            console.log('wait');
        } else {
            console.log('successFile');
        }
    }
    checkPicture(state) {
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
        if (state !== 'success') {
            console.log('wait');
            setTimeout(this.checkPicture, 5000);
        } else {
            console.log('successPicture');
        }
    }
    checkSuccess() {
        console.log(this.countFileStatus);
        console.log(this.countPicStatus);
        if (this.countPicStatus === this.countPicChoose && this.countFileStatus === this.countFileChoose) {
            console.log('post');
            this.UPLOADALL();
        } else {
            setTimeout( () => {
                this.checkSuccess();
            }, 4000);
            console.log('upload again');
            console.log(this.countFileStatus);
            console.log(this.countPicStatus);
        }
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

    getFeed(code, name) {
        this.postService.getFeed(code).subscribe(data => {
            this.post = data;
            this.nameSubject = name;
            this.codeSubject = code;
            this.posts.subject.code = this.codeSubject;
            this.posts.subject.name = this.nameSubject;
            console.log(this.post);
        });
    }

    getEmbedUrl(link) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(link);
    }

    isComment(posts) {
        posts.comment = true;
    }

    notComment(posts) {
        posts.comment = false;
    }

    upload(event, index) {
        this.file[index] = (event.target.files[0]);
        this.countFileChoose += 1;
        if (this.file[index].name.includes('pdf', 0) ||
            this.file[index].name.includes('doc', 0) ||
            this.file[index].name.includes('ppt', 0) ||
            this.file[index].name.includes('xls', 0) ||
            this.file[index].name.includes('zip', 0) ||
            this.file[index].name.includes('rar', 0)
        ) {
        } else {
            alert('Please choose file as type : pdf, word , exel, ppt, rar and zip');
        }
    }

    refresh() {
        this.postService.getFacultyTable().subscribe((res) => {
            this.faculty = res;
            this.dataSource = new FacultyDataSource(this.postService);
        });
    }

    isAddFunc() {
        if (this.tempVdoLink.length === this.count) {
            alert('Limited video at 5 link');
        } else {
            if (this.isAddVdo === true) {
                this.tempVdoLink2[this.count] = '1';
                this.count += 1;
                console.log(this.tempVdoLink);
                console.log(this.count);
            }
        }
    }

    isClear() {
        if (this.count > 0) {
            this.count -= 1;
            this.tempVdoLink2[this.count] = '';
            this.tempVdoLink[this.count] = '';
        }
    }

    isFileFunc() {
        if (this.tempFileLink.length === this.countFile) {
            alert('Limited files at 5 file');
        } else {
            if (this.isFile === true) {
                this.tempFileLink2[this.countFile] = '1';
                this.countFile += 1;
            } else if (this.isFile === false) {
                this.isFile = true;
            }
        }
    }

    isFileClear() {
        if (this.countFile === 0) {
            this.isFile = false;

        } else {
            this.countFile -= 1;
            this.tempFileLink[this.countFile] = '';
            this.tempFileLink2[this.countFile] = '';
        }
    }

    // Picture
    isPicFunc() {
        if (this.tempPicLink.length === this.countPic) {
            alert('Limited pictures at 30');
        } else {
            if (this.isPic === true) {
                this.tempPicLink2[this.countPic] = '1';
                this.countPic += 1;
            } else if (this.isPic === false) {
                this.isPic = true;
            }
        }
    }

    isPicClear() {
        if (this.countPic === 0) {
            this.isPic = false;

        } else {
            this.countPic -= 1;
            this.tempPicLink[this.countPic] = '';
            this.tempPicLink2[this.countPic] = '';
        }
    }

    uploadPic(event, index) {
        this.picture[index] = event.target.files[0];
        this.countPicChoose += 1;
        if (this.picture[index].name.includes('png', 0) ||
            this.picture[index].name.includes('PNG', 0) ||
            this.picture[index].name.includes('jpg', 0) ||
            this.picture[index].name.includes('JPG', 0)
        ) {
        } else {
            alert('Please choose picture as type : png or jpg');
        }
    }

    Post() {
        if (this.isPost === false) {
            this.isUpload = false;
        }
        this.isPost = !this.isPost;
    }

    isUploadFunc() {
        this.isUpload = !this.isUpload;
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
