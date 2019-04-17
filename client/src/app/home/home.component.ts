import {Component, Injectable, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {FormBuilder, FormGroup} from '@angular/forms';



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    profileForm: FormGroup;
    constructor(private  formBuilder: FormBuilder, private postService: PostService,
                private httpClient: HttpClient, iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer) {
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
        email: '',
        vdoLink: '',
        imgId: ''
    };


    ngOnInit() {
        this.profileForm = this.formBuilder.group({
            name: [''],
            profile: ['']
        });
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
        if (this.select.vdoLink === '') {
            console.log(this.select.text);
            this.httpClient.get('http://localhost:12345/post/' + this.select.text + '/'
                + this.select.email + '/'
                + this.codeSubject, this.select)
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
                    },
                    error => {
                        alert('Error post');
                    }
                );
        } else {
            console.log(this.select.text);
            let temp =  this.select.vdoLink.split('=');
            this.select.vdoLink = temp[1];
            if (this.select.vdoLink.endsWith('&list', this.select.vdoLink.length)) {
                let temp = this.select.vdoLink.split('&');
                this.select.vdoLink = temp[0];
            }
            alert(this.select.vdoLink)
            this.httpClient.get('http://localhost:12345/post/' + this.select.text + '/'
                + this.select.email + '/'
                + this.codeSubject + '/'
                + this.select.vdoLink, this.select)
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
                        this.select.vdoLink = '';
                    },
                    error => {
                        alert('Error post');
                    }
                );

        }


    }
    getMajor(facultyName) {
        this.major = null;
        this.postService.getMajor(facultyName).subscribe(data => {
            this.major = data;
            console.log(this.major);
        });
    }
    getSubject(majorName) {
        this.subject = null;
        this.postService.getSubject(majorName).subscribe(data => {
            this.subject = data;
            console.log(this.subject);
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

    onSelectedFile(event) {
        if (event.target.files.length > 0) {
            console.log(event.target.files);
            const profile = event.target.files[0];
            this.profileForm.get('profile').setValue(profile);
        }
    }
    onSubmit() {
        const formData = new FormData();
        formData.append('profile', this.profileForm.get('profile').value);
        this.postService.upload(formData).subscribe(
            data => {
                if (data != null) {
                    alert('Upload file success');
                    this.select.imgId = data.id;
                }
            },
            error => {
            }
        );
    }
    getEmbedUrl(link) {
        console.log(link);
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + link);
    }
    isComment(posts) {
        posts.comment = true;
    }
    notComment(posts) {
        posts.comment = false;
    }
}
