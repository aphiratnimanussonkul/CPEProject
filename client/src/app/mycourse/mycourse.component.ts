import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../service/authen.service';
import set = Reflect.set;
import { empty } from 'rxjs';

export interface FacultyComponent {
  name: string;
}

export interface Post {
  text: string;
  user: {
    name: string;
    email: string;
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
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MycourseComponent implements OnInit {
  constructor(private postService: PostService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer, private storage: AngularFireStorage, private route: ActivatedRoute,
    private router: Router, private authenService: AuthenService) {
    iconRegistry.addSvgIcon(
      'more',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
    iconRegistry.addSvgIcon(
      'hamIcon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
    iconRegistry.addSvgIcon(
      'logout',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
    this.codeSubject = this.route.snapshot.paramMap.get('code');
    this.nameSubject = this.route.snapshot.paramMap.get('name');
  }

  // Firebase Authen
  user: firebase.User;
  //
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
  ref: Array<AngularFireStorageReference> = new Array<AngularFireStorageReference>(30);
  refFile: Array<AngularFireStorageReference> = new Array<AngularFireStorageReference>(5);
  task: AngularFireUploadTask;
  //
  nameSubject: string;
  codeSubject: string;
  faculty: Array<any>;
  major: Array<any>;
  subject: Array<any>;
  post: Array<any>;
  select: any = {
    text: ''
  };
  posts: Post = {
    text: '',
    user: {
      name: '',
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
  // table faculty
  dataSource = new FacultyDataSource(this.postService, this.posts.user.email);
  columnsToDisplay = ['สำนักวิชา'];
  // post
  isPost: boolean;
  isUpload: boolean;
  file: Array<File> = new Array<File>(5);
  picture: Array<File> = new Array<File>(30);
  countFileChoose: number;
  countPicChoose: number;
  countFileStatus: number;
  countPicStatus: number;
  disPlayName: string;
  isPosting: boolean;

  countEmbedUrl: number;
  ngOnInit() {
    this.authenService.getLoggedInUser().subscribe(user => {
      console.log(user);
      this.user = user;
      this.posts.user.email = user.email;
      if (user.displayName !== null) {
        this.disPlayName = user.displayName;
      } else {
        this.disPlayName = user.email;
      }
    });
    this.posts.subject.code = this.codeSubject;
    this.posts.subject.name = this.nameSubject;

    this.countEmbedUrl = 0;
    this.countPicChoose = 0;
    this.countFileChoose = 0;
    this.countFileStatus = 0;
    this.countPicStatus = 0;
    this.isUpload = false;
    this.isPost = false;
    this.isPosting = false;
    this.isFile = true;
    this.isPic = true;
    this.isAddVdo = true;
    this.count = 0;
    this.countFile = 0;
    this.countPic = 0;
    this.refresh();

    this.postService.getFeed(this.codeSubject).subscribe(data => {
      this.post = data;
    });
  }

  UPLOAD() {
    console.log('File');
    for (let i = 0; i < this.countFileChoose; i++) {
      this.refFile[i] = this.storage.ref(this.file[i].name);
      this.refFile[i].put(this.file[i]).then((result) => {
        if (result.state !== 'success') {
          this.checkFile(result.state);
        } else {
          this.refFile[i].getDownloadURL().subscribe(
            data => {
              console.log('push');
              this.posts.file.push(data);
              this.posts.filename.push(this.file[i].name);
              this.countFileStatus += 1;
              console.log(this.countFileStatus);
              console.log(this.posts.file);
            }
          );
        }
      });
    }
  }

  UPLOADPIC() {
    console.log('Pic');
    if (this.countFileChoose !== this.countFileStatus) {
      setTimeout(() => {
        this.UPLOADPIC();
      }, 200);
    } else {
      for (let i = 0; i < this.countPicChoose; i++) {
        this.ref[i] = this.storage.ref(this.picture[i].name);
        this.ref[i].put(this.picture[i]).then((result) => {
          if (result.state !== 'success') {
            this.checkPicture(result.state);
          } else {
            this.ref[i].getDownloadURL().subscribe(
              data => {
                console.log('push');
                this.posts.picture.push(data);
                this.countPicStatus += 1;
                console.log(this.countPicStatus);
                console.log(this.posts.picture);
              }
            );
          }
        });
      }
    }
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
          this.isPost = false;
          this.isPosting = false;
          this.getFeed(this.codeSubject, this.nameSubject);
        }
      },
      error1 => {
      }
    );
    this.posts.text = '';
    this.select.text = '';
    this.posts.file.splice(0);
    this.posts.vdolink.splice(0);
    this.posts.picture.splice(0);
    this.file.splice(0);
    this.picture.splice(0);
    this.countFileChoose = 0;
    this.countFileStatus = 0;
    this.countPicChoose = 0;
    this.countPicStatus = 0;
    this.countPic = 0;
    this.countFile = 0;
    this.count = 0;
    this.ref.splice(0);
    this.refFile.splice(0);
  }

  test() {
    this.isPosting = true;
    if (this.countPicChoose !== 0 || this.countFileChoose !== 0) {
      alert('Uploading...');
    }
    if (this.countFileChoose !== 0) {
      this.UPLOAD();
    }
    if (this.countPicChoose !== 0) {
      this.UPLOADPIC();
    }
    this.checkSuccess();
  }

  checkFile(state) {
    if (state !== 'success') {
      setTimeout(this.checkFile, 300);
      console.log('wait');
    } else {
      console.log('successFile');
    }
  }

  checkPicture(state) {
    if (state !== 'success') {
      console.log('wait');
      setTimeout(this.checkPicture, 300);
    } else {
      console.log('successPicture');
    }
  }

  checkSuccess() {
    if (this.countPicStatus === this.countPicChoose && this.countFileStatus === this.countFileChoose) {
      this.UPLOADALL();
    } else {
      setTimeout(() => {
        this.checkSuccess();
      }, 300);
    }
  }

  getMajor(facultyName) {
    this.major = null;
    this.postService.getMajorByEmail(facultyName, this.posts.user.email).subscribe(data => {
      this.major = data;
    });

  }

  getSubject(majorName) {
    this.subject = null;
    this.postService.getSubjectByEmail(majorName, this.posts.user.email).subscribe(data => {
      this.subject = data;
    });
  }

  getFeed(code, name) {
    this.router.navigate(['/mycourse', code, name]);
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
    if (event.target.files[0].size > 25000000) {
      alert('The file you have selected is too large. The maximum size is 25MB. Please compress file');
    } else {
      this.file[index] = event.target.files[0];
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
  }

  refresh() {
    if (this.posts.user.email === '') {
      setTimeout(() => {
        this.refresh();
      }, 10);
    } else {
      this.postService.getFacultyTableByEmail(this.posts.user.email).subscribe((res) => {
        this.faculty = res;
        this.dataSource = new FacultyDataSource(this.postService, this.posts.user.email);
      });
    }
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
      this.countFileChoose -= 1;
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
      this.countPicChoose -= 1;
      this.tempPicLink[this.countPic] = '';
      this.tempPicLink2[this.countPic] = '';
    }
  }

  uploadPic(event, index) {
    if (event.target.files[0].size > 1000000) {
      alert('The picture you have selected is too large. The maximum size is 1MB.');
    } else {
      this.picture[index] = event.target.files[0];
      console.log(this.picture);
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

  delete(postid) {
    this.httpClient.get('http://localhost:12345/deletepost/' + postid, postid).subscribe(
      data => {
        if (!data) {
          alert('Deleted');
          this.getFeed(this.codeSubject, this.nameSubject);
        }
      }
    );
  }
  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }
  unfollow(code) {
    this.httpClient.get('http://localhost:12345/unfollow/' + this.posts.user.email + '/' + code).subscribe(
      data => {
        if (!data) {
          alert('Unfollow success');
          this.postService.getFacultyTableByEmail(this.posts.user.email).subscribe((res) => {
            this.faculty = res;
            this.dataSource = new FacultyDataSource(this.postService, this.posts.user.email);
          });
        }
      },
      error => { }
    );
  }
}

export class FacultyDataSource extends DataSource<any> {
  email: string;

  constructor(private postService: PostService, email: string) {
    super();
    this.email = email;
  }

  connect(): Observable<FacultyComponent[]> {
    return this.postService.getFacultyTableByEmail(this.email);
  }

  disconnect() {
    console.log('disconnect');
  }
}
