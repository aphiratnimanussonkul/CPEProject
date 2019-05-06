import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../service/authen.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  user: firebase.User;

  constructor(
    private authenService: AuthenService, private route: ActivatedRoute, private router: Router
  ) { }
  
  ngOnInit() {
    this.authenService.getLoggedInUser()
      .subscribe(user => {
        this.user = user;
      })
  }

  logout() {
    this.router.navigate(['/login']);
    this.authenService.logout();
  }

  profile(){
    this.router.navigate(['/profile']);
  }
}