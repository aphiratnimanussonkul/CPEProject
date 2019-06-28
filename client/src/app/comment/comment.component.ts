import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs/Observable';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenService} from '../service/authen.service';
import {ModalDirective} from 'angular-bootstrap-md';

export  interface Comment {
  text: string;
  user: {
    name: string
    email: string
  };
}
export  interface Feedback {
  text: string;
  user: {
    name: string
    email: string
  };
}
export  interface Request {
  subjectcode: string;
  subjectname: string;
  user: {
    name: string
    email: string
  };
}

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
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CommentComponent implements OnInit {
  @ViewChild('basicModal') basicModal: ModalDirective;

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
    this.postId = this.route.snapshot.paramMap.get('postid');
  }

  // Firebase Authen
  user: firebase.User;
  isPic: boolean;
  nameSubject: string;
  codeSubject: string;
  postId: string;
  faculty: Array<any>;
  major: Array<any>;
  subject: Array<any>;
  post: Array<any>;
  comment: Array<any>;
  feedback: Array<any>;
  request: Array<any>;
  select: any = {
    text: '',
    commentText: '',
    feedbackText: '',
    subjectcodeText: '',
    subjectnameText: '',
    inputCode: ''
  };
  comments: Comment = {
    text: '',
    user: {
      name: '',
      email: ''
    },
  };

  // post
  disPlayName: string;
  ngOnInit() {
    this.getUser();
    this.authenService.getUserAndSaveOnsService();
    // user comment
    this.comments.user.email = this.authenService.user.email;
    this.comments.user.name = this.authenService.user.name;
    this.isPic = true;

    this.postService.getPostById(this.postId).subscribe(data => {
      this.post = data;
      this.comment = data.comment;
      console.log(this.post);
    });
  }
  getUser() {
    this.authenService.getUserAndSaveOnsService();
    if (!this.authenService.check) {
      setTimeout(() => {
        this.getUser();
      }, 50);
    } else {
      this.getFeed(this.postId);
    }
  }
  getFeed(id) {
    this.router.navigate(['/comment', id]);
    this.postService.getPostById(id).subscribe(data => {
      this.post = data;
    });
  }
  getFeedComment(postId){
    this.router.navigate(['/comment', postId]);
    this.postService.getFeed(postId).subscribe(data => {
      this.post = data;
    });
  }

  getEmbedUrl(link) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
  delete(postid, picture, file) {
    if (picture.length !== 0) {
      for (let i = 0; i < picture.length; i++) {
        let temp = (<string>picture[i]).split('/');
        let picname = temp[7].split('?');
        this.storage.ref(picname[0]).delete();
      }
    }
    if (file.length !== 0) {
      for (let i = 0; i < file.length; i++) {
        let temp = (<string>file[i]).split('/');
        let filename = temp[7].split('?');
        this.storage.ref(filename[0]).delete();
      }
    }
    this.httpClient.get(this.postService.API + '/deletepost/' + postid, postid).subscribe(
      data => {
        if (!data) {
          alert('Deleted');
          this.getFeed(this.postId);
        }
      }
    );
  }

  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }
  postComment(postsID) {
    // alert(postsID);
    this.comments.text = this.select.commentText;
    if (this.comments.text === '')
      alert('comment null');
    else{
      this.postService.createComment(this.comments, postsID).subscribe(
        data => {
          if (data) {
          } else {
            alert('comment success!');
            this.getFeed(this.postId);
          }
        },
        error1 => {
        }
      );
      this.comments.text = '';
      this.select.commentText = '';
    }
  }
  isComment(posts) {
    posts.checkComment = true;
  }

  notComment(posts) {
    posts.checkComment = false;
  }
  getBack(code, name) {
    this.router.navigate(['/mycourse', code, name]);
  }
  deletecomment (id) {
    this.httpClient.get(this.postService.API + '/deletecomment/' + id + '/' + this.postId).subscribe(data => {
      if (!data) {
        alert('ลบ comment สำเร็จ');
        this.postService.getPostById(this.postId).subscribe(res => {
          this.post = res;
          this.comment = res;
        });
      }
    });
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
