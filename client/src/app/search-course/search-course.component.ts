import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PostService} from '../service/post.service';
import {ActivatedRoute, Router} from '@angular/router';




@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.css']
})

export class SearchCourseComponent implements OnInit {
  constructor(private postService: PostService, private httpClient: HttpClient, iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    iconRegistry.addSvgIcon(
        'more',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
    iconRegistry.addSvgIcon(
        'hamIcon',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
    iconRegistry.addSvgIcon(
        'logout',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/logout.svg'));
    this.code = this.route.snapshot.paramMap.get('code');
  }
  code: string;
  ngOnInit() {
    console.log(this.code);
  }
}

