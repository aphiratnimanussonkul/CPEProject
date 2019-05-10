import {Component, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry, MatPaginator, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenService} from '../service/authen.service';
import {AdminService} from '../service/admin.service';

export interface Faculty {
  name: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  faculty: Faculty[];
  constructor(private adminService: AdminService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
              private route: ActivatedRoute, private router: Router,
              private authenService: AuthenService) {
  }

  facultyname: '';
  dataSource:  MatTableDataSource<any>;
  displayedColumns = ['ลำดับ', 'สำนักวิชา', 'หมายเหตุ'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
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
}

