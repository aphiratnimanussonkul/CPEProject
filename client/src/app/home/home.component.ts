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

export class Variable{
    static faculty: Array<any>;
    static faculties: 'sadasd';
}

interface FoodNode {
    name: string;
    children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
    {
        name: 'Variable.faculties',
        children: [
            {name: 'Apple'},
            {name: 'Banana'},
            {name: 'Fruit loops'},
        ]
    }, {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [
                    {name: 'Broccoli'},
                    {name: 'Brussel sprouts'},
                ]
            }, {
                name: 'Orange',
                children: [
                    {name: 'Pumpkins'},
                    {name: 'Carrots'},
                ]
            },
        ]
    },
];

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

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

        this.dataSource.data = TREE_DATA;
    }

    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();
    post: Array<any>;
    user: Array<any>;
    select: any = {
        test: 'wowww',
        text: '',
        email: ''
    };
    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;


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
            Variable.faculty = data;
            console.log(Variable.faculty);
            Variable.faculties = data[0].name;
            console.log(Variable.faculties);
        });
    }

    test() {
        // alert('do');
        if (this.select.text === '') {
            alert('null test');
        }
        console.log(this.select.text);
        this.httpClient.get('http://localhost:12345/post/' + this.select.text + '/' + this.select.email, this.select)
            .subscribe(
                data => {
                    console.log(data);
                    if (data) {
                        alert('somthing was wrong');
                    } else {
                        alert('post success');
                        location.reload();
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

}
