import {Component, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry, MatPaginator, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenService} from '../service/authen.service';
import {AdminService} from '../service/admin.service';

export interface Faculty {
  name: string;
}
export interface Major {
  name: string;
}
export interface Subject {
  name: string;
}
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  faculty: Faculty[];
  major: Major[];
  constructor(private adminService: AdminService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
              private route: ActivatedRoute, private router: Router,
              private authenService: AuthenService) {
  }
  isFaculty; isMajor; isSubject; isPost; isComment; isUser: boolean;
  facultyname: '';
  select: any = {
    selectFaculty: '',
    selectMajor: ''
  };
  subjectcode: '';
  subjectname: '';
  majorname: '';
  facultyArray: Array<any>;
  majorArray: Array<any>;
  dataSource:  MatTableDataSource<any>;
  dataSourceMajor:  MatTableDataSource<any>;
  dataSourceSubject:  MatTableDataSource<any>;
  displayedColumns = ['ลำดับ', 'สำนักวิชา', 'หมายเหตุ'];
  displayedColumnsMajor = ['ลำดับ', 'สาขาวิชา', 'สำนักวิชา', 'หมายเหตุ'];
  displayedColumnsSubject = ['ลำดับ', 'ชื่อวิชา', 'รหัสวิชา', 'สาขาวิชา', 'สำนักวิชา', 'หมายเหตุ'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
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
    } else {
      this.httpClient.get('http://localhost:12345/subject/' + this.subjectname + '/'
        + this.subjectcode + '/'
        + this.select.selectMajor).subscribe(
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
  deleteSubject(code) {
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
}

