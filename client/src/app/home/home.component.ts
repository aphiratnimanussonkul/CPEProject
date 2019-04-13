import {Component, Injectable, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PostService} from '../service/post.service';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    panelOpenState = false;
    constructor(private  postService: PostService, private httpClient: HttpClient,
                iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'more',
            sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
        iconRegistry.addSvgIcon(
            'hamIcon',
            sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
        iconRegistry.addSvgIcon(
            'logout',
            sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
    }
    nameSubject: string;
    codeSubject: string;
    faculty: Array<any>;
    major: Array<any>;
    subject: Array<any>;
    post: Array<any>;
    user: Array<any>;
    select: any = {
        test: 'wowww',
        text: '',
        email: ''
    };


    ngOnInit(){
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
        // alert('do');
        if (this.select.text === '') {
            alert('null test');
        }
        console.log(this.select.text);
        this.httpClient.get('http://localhost:12345/post/' + this.select.text + '/' + this.select.email + '/' + this.codeSubject, this.select)
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
                    // if (data) {
                    //   alert('Add Room Success');
                    //   console.log('send' + this.select.memberUserName)
                    //   this.refresh(this.select.memberUserName);
                    // }
                    // else {
                    //   alert('This Room number have alrady exist')
                    // }
                },
                error => {
                    alert('Error cannot add room');
                }
            );
    }
    getMajor(facultyName){
        this.major = null;
        this.postService.getMajor(facultyName).subscribe(data => {
            this.major = data;
            console.log(this.major);
        });
    }
    getSubject(majorName){
        this.subject = null;
        this.postService.getSubject(majorName).subscribe(data => {
            this.subject = data;
            console.log(this.subject);
        });
    }
    getFeed(code){
        this.postService.getFeed(code).subscribe(data => {
            this.post = data;
            this.nameSubject = data[0].subject.name;
            this.codeSubject = data[0].subject.code;
            console.log(this.post);
        });
    }

}
