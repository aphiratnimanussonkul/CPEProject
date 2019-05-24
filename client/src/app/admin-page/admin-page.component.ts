import {Component, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry, MatPaginator, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenService} from '../service/authen.service';
import {AdminService} from '../service/admin.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

export interface Post {
  text: string;
}

export interface Faculty {
  name: string;
}

export interface Major {
  name: string;
}

export interface Subject {
  name: string;
  code: string;
  picture: string;
  major: {
    name: string;
  };
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminPageComponent implements OnInit {
  faculty: Faculty[];
  major: Major[];

  constructor(private adminService: AdminService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
              private route: ActivatedRoute, private router: Router,
              private authenService: AuthenService, private storage: AngularFireStorage) {
  }

  ref: AngularFireStorageReference;
  picture: File;
  isFaculty;
  isMajor;
  isSubject;
  isPost;
  isComment;
  isUser: boolean;
  facultyname: '';
  select: any = {
    selectFaculty: '',
    selectMajor: ''
  };
  subject: Subject = {
    name: '',
    picture: '',
    code: '',
    major: {
      name: ''
    }
  };
  isPosting: boolean;
  posts: Array<any>;
  subjectcode: '';
  subjectname: '';
  majorname: '';
  facultyArray: Array<any>;
  majorArray: Array<any>;
  dataSource: MatTableDataSource<any>;
  dataSourceMajor: MatTableDataSource<any>;
  dataSourceSubject: MatTableDataSource<any>;
  dataSourcePost: MatTableDataSource<any>;
  displayedColumns = ['ลำดับ', 'สำนักวิชา', 'หมายเหตุ'];
  displayedColumnsMajor = ['ลำดับ', 'สาขาวิชา', 'สำนักวิชา', 'หมายเหตุ'];
  displayedColumnsSubject = ['ลำดับ', 'ชื่อวิชา', 'รหัสวิชา', 'สาขาวิชา', 'สำนักวิชา', 'หมายเหตุ'];
  displayedColumnsPost = ['ข้อความ', 'ผู้ใช้', 'ชื่อวิชา', 'รหัสวิชา', 'หมายเหตุ'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.isPosting = false;
    this.isComment = this.isFaculty = this.isMajor = this.isUser = this.isPost = this.isSubject = false;
    this.chooseFaculty();
    this.adminService.getFacultyTable().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  addFaculty() {
    if (this.facultyname === '') {
      alert('กรุณาใส่ชื่อสำนักวิชา');
    } else {
      this.httpClient.get('http://localhost:12345/faculty/' + this.facultyname).subscribe(
        data => {
          if (!data) {
            alert('เพิ่มสำนักวิชา สำเร็จ');
            this.facultyname = '';
            this.getFaculty();
          } else {
            alert('ไม่สามารถเพิ่มสำนักวิชา');
          }
        }
      );
    }
  }

  getFaculty() {
    this.adminService.getFacultyTable().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteFaculty(facultyname) {
    this.httpClient.get('http://localhost:12345/deletefaculty/' + facultyname).subscribe(
      data => {
        if (!data) {
          alert('ลบสำนักวิชา สำเร็จ');
          this.getFaculty();
        } else {
          alert('ไม่สามารถลบสำนักวิชา');
        }
      }
    );
  }

  chooseFaculty() {
    this.isFaculty = true;
    this.isComment = this.isMajor = this.isUser = this.isPost = this.isSubject = false;
  }

  chooseMajor() {
    this.getFacultyArray();
    this.getMajor();
    this.isMajor = true;
    this.isComment = this.isFaculty = this.isUser = this.isPost = this.isSubject = false;
  }

  chooseSubject() {
    this.select.selectFaculty = '';
    this.getFacultyArray();
    this.getSubject();
    this.isSubject = true;
    this.isComment = this.isFaculty = this.isUser = this.isPost = this.isMajor = false;
  }

  // Major
  getFacultyArray() {
    this.adminService.getFaculty().subscribe(
      data => {
        this.facultyArray = data;
      }
    );
  }

  getMajor() {
    this.adminService.getMajorTable().subscribe(data => {
      this.dataSourceMajor = new MatTableDataSource(data);
      this.dataSourceMajor.paginator = this.paginator;
    });
  }

  addMajor() {
    if (this.majorname === '') {
      alert('กรุณาใส่ชื่อสาขานักวิชา');
    } else if (this.select.selectFaculty === '') {
      alert('กรุณาเลือกสำนักวิชา');
    } else {
      this.httpClient.get('http://localhost:12345/major/' + this.majorname + '/' + this.select.selectFaculty).subscribe(
        data => {
          if (!data) {
            alert('เพิ่มสาขาวิชา สำเร็จ');
            this.majorname = '';
            this.getMajor();
          } else {
            alert('ไม่สามารถเพิ่มสาขาวิชา');
          }
        }
      );
    }
  }

  deleteMajor(majorname) {
    this.httpClient.get('http://localhost:12345/deletemajor/' + majorname).subscribe(
      data => {
        if (!data) {
          alert('ลบสาขาวิชา สำเร็จ');
          this.getMajor();
        } else {
          alert('ไม่สามารถลบสาขาวิชา');
        }
      }
    );
  }

  // Subject
  getMajorArray(faculty) {
    this.adminService.getMajorFaculty(faculty).subscribe(
      data => {
        console.log(data);
        this.majorArray = data;
      }
    );
  }

  getSubject() {
    this.adminService.getSubjectTable().subscribe(data => {
      this.dataSourceSubject = new MatTableDataSource(data);
      this.dataSourceSubject.paginator = this.paginator;
    });
  }

  addSubject() {
    if (this.subjectname === '') {
      alert('กรุณาใส่ชื่อวิชา');
    } else if (this.subjectcode === '') {
      alert('กรุณาใส่รหัสวิชา');
    } else if (this.select.selectFaculty === '') {
      alert('กรุณาเลือกสำนักวิชา');
    } else if (this.select.selectMajor === '') {
      alert('กรุณาเลือกสาขาวิชา');
    } else if (this.subject.picture === '') {
      alert('กรุณาเลือกรุปภาพ');
    } else {
      this.subject.name = this.subjectname;
      this.subject.code = this.subjectcode;
      this.subject.major.name = this.select.selectMajor;
      this.adminService.createSubject(this.subject).subscribe(
        data => {
          if (!data) {
            alert('เพิ่มวิชา สำเร็จ');
            this.subjectcode = '';
            this.subjectname = '';
            this.getSubject();
          } else {
            alert('ไม่สามารถเพิ่มวิชา');
          }
        }
      );
    }
  }

  deleteSubject(code, picture) {
    let temp = (<string>picture).split('/');
    let picname = temp[7].split('?');
    this.storage.ref(picname[0]).delete();
    this.httpClient.get('http://localhost:12345/deletesubject/' + code).subscribe(
      data => {
        if (!data) {
          alert('ลบวิชา สำเร็จ');
          this.getSubject();
        } else {
          alert('ไม่สามารถลบวิชา');
        }
      }
    );
  }

  // Post
  choosePost() {
    this.getPost();
    this.isPost = true;
    this.isComment = this.isFaculty = this.isUser = this.isSubject = this.isMajor = false;
  }

  getPost() {
    this.adminService.getPostTable().subscribe(data => {
      this.dataSourcePost = new MatTableDataSource(data);
      this.dataSourcePost.paginator = this.paginator;
    });
  }

  deletePost(postid, picture, file) {
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
    this.httpClient.get('http://localhost:12345/deletepost/' + postid).subscribe(
      data => {
        if (!data) {
          alert('ลบวิชา โพสสำเร็จ');
          this.getPost();
        } else {
          alert('ไม่สามารถลบโพส');
        }
      }
    );
  }

  getPostDetail(postid) {
    this.adminService.getPostById(postid).subscribe(
      data => {
        this.posts = data;
        console.log(data);
      }
    );
  }

  uploadPic(event) {
    this.isPosting = true;
    if (event.target.files[0].size > 1000000) {
      alert('The picture you have selected is too large. The maximum size is 1MB.');
    } else {
      this.picture = event.target.files[0];
      if (this.picture.name.includes('png', 0) ||
        this.picture.name.includes('PNG', 0) ||
        this.picture.name.includes('jpg', 0) ||
        this.picture.name.includes('JPEG', 0) ||
        this.picture.name.includes('JPG', 0)
      ) {
        this.ref = this.storage.ref('PicMajor/' + this.dateAsYYYYMMDDHHNNSS(new Date()));
        this.ref.put(this.picture).then((result) => {
          this.ref.getDownloadURL().subscribe(
            data => {
              this.subject.picture = data;
              if (this.subject.picture !== '') {
                this.isPosting = false;
              }
            }
          );
        });
      } else {
        alert('Please choose picture as type : png or jpg');
      }
    }
  }

  dateAsYYYYMMDDHHNNSS(date): string {
    return date.getFullYear()
      + '-' + this.leftpad(date.getMonth() + 1, 2)
      + '-' + this.leftpad(date.getDate(), 2)
      + '-' + this.leftpad(date.getHours(), 2)
      + '-' + this.leftpad(date.getMinutes(), 2)
      + '-' + this.leftpad(date.getSeconds(), 2);
  }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }
}

