import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../service/authen.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: firebase.User;

  constructor(
    private service: AuthenService, private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit() {
    this.service.getLoggedInUser()
      .subscribe( user => {
        console.log( user );
        this.user = user;
      }); 
  }

  LoginWithGoogle(){
    console.log('Login...Google');
    this.service.logingoogle(); 
    this.router.navigate(['/profile']);
  }

  LoginWithFacebook(){
    console.log('Login...Facebook');
    this.service.loginfacebook(); 
    this.router.navigate(['/profile']);
  }

  LoginWithGithub(){
    console.log('Login...Github');
    this.service.logingithub();
    this.router.navigate(['/profile']); 
  }

  logout(){
    this.service.logout();
  }

}
