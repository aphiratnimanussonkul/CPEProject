import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: string[] = [];
  opened=true;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/more.svg'));
    iconRegistry.addSvgIcon(
      'hamIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/hamIcon.svg'));
  }

  ngOnInit() {
  }

}
