import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';



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
    file: ['', '', '', '', ''],
    picture: ['', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', ''],
    subject: {
      name: '',
      code: ''
    }
  };

  ngOnInit() {
    this.isFile = true;
    this.isPic = true;
    this.isAddVdo = true;
    this.count = 0;
    this.countFile = 0;
    this.countPic = 0;
    this.refresh();
    this.postService.getPost().subscribe(data => {
      this.post = data;
    });
    this.postService.getUser('B5923151@gmail.com').subscribe(data => {
      this.user = data;
      this.posts.user.firstname = data.firstname;
      this.posts.user.lastname = data.lastname;
      this.posts.user.email = data.email;
    });
    this.postService.getFaculty().subscribe(data => {
      this.faculty = data;
    });
  }

  test() {
    this.posts.text = this.select.text;
    this.posts.file = this.tempFileLink;
    this.posts.vdolink = this.tempVdoLink;
    this.posts.picture = this.tempPicLink;
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
    this.tempVdoLink = null;
    this.tempPicLink = null;
    this.tempVdoLink2 = null;
    this.tempFileLink = null;
    this.tempFileLink2 = null;
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
    this.downloadURL[index] = null;
    const file = event.target.files[0];
    if (file.name.includes('pdf', 0) |
        file.name.includes('docx', 0) |
        file.name.includes('doc', 0)
    ) {
      const filePath = file.name;
      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.uploadState[index] = this.task.snapshotChanges().pipe(map(s => s.state));
      this.uploadProgress[index] = this.task.percentageChanges();
      this.downloadURL[index] = this.ref.getDownloadURL();
      console.log(this.downloadURL);
      if (this.downloadURL[index] === null) {
        alert('Can not upload file, please try again');
        this.downloadURL[index] = null;
      }
    } else {
      alert('Please choose file as type : pdf, word , exel and ppt');
    }
  }

  refresh() {
    this.postService.getFacultyTable().subscribe((res) => {
      this.faculty = res;
      this.dataSource = new FacultyDataSource(this.postService);
    });
  }

  checkLink(link) {
    console.log(link);
    if (link.includes('pdf', 0) |
        link.includes('ppt', 0) |
        link.includes('xls', 0) |
        link.includes('doc', 0)) {
      link.isLinkDocument = true;
      link.isLinkPic = false;
    } else {
      link.isLinkPic = true;
      link.isLinkDocument = false;
    }
    console.log(link.isLinkPic);
    console.log(link.isLinkDocument);
  }

  getFireUrl(link) {
    return 'https://firebasestorage.googleapis.com/v0/b/cpeproject.appspot.com/o/' + link.file;
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

  // file
  URL(url, index) {
    if (url === null) {
      alert('Can not upload');
    }
    this.tempFileLink[index] = url;
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
    this.downloadURLPic[index] = null;
    const file = event.target.files[0];
    if (file.name.includes('jpg', 0) |
        file.name.includes('png', 0)
    ) {
      const filePath = file.name;
      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.uploadStatePic[index] = this.task.snapshotChanges().pipe(map(s => s.state));
      this.uploadProgressPic[index] = this.task.percentageChanges();
      this.downloadURLPic[index] = this.ref.getDownloadURL();
      if (this.downloadURLPic[index] === null) {
        alert('Can not upload file, please try again');
      }
    } else {
      alert('Please choose picture!');
    }
  }

  URLPic(url, index) {
    this.tempPicLink[index] = url;
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
