import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  checkAddCommnet: boolean;
  events: string[] = [];
  opened=true;
  panelOpenState = false;

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

  comment(){
      this.checkAddCommnet = true;
  }
}
