import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {PostService} from './post.service';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';

// import { HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  public user: firebase.User;
  public API = '//localhost:12345';

  constructor(private afAuth: AngularFireAuth, private postService: PostService,
              private router: Router, private storage: AngularFireStorage) {
  }

  logingoogle() {
    console.log('Redirecting to Google login provider');
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  loginfacebook() {
    console.log('Redirecting to Facebook login provider');
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  logingithub() {
    console.log('Redirecting to Github login provider');
    this.afAuth.auth.signInWithRedirect(new auth.GithubAuthProvider());
  }

  logintwitter() {
    console.log('Redirecting to Github login provider');
    this.afAuth.auth.signInWithRedirect(new auth.TwitterAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getLoggedInUser() {
    return this.afAuth.authState;
  }

  getUserAndSaveOnsService() {
    this.getLoggedInUser().subscribe(user => {
      this.user = user;
      this.postService.getSubjectParseToArray(user.email);
      if (!this.user.email) {
        this.router.navigate(['/login']);
      }
    });
    if (this.postService.isUploading) {
      this.postService.checkUpload();
    }
  }

}
