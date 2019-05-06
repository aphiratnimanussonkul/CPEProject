import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatInputModule, MatListModule, MatToolbarModule, MatTableModule,
  MatSidenavModule, MatCheckboxModule, MatDialogModule, MatBadgeModule, MatIconModule, MatSelectModule,  MatDatepickerModule,
  MatGridListModule, MatNativeDateModule, MatMenuModule, MatRadioModule} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthenService } from './service/authen.service';
import { ProfileService } from './service/profile.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { HomeComponent } from './home/home.component';
import { MycourseComponent } from './mycourse/mycourse.component';
import {PostService} from './service/post.service';

const appRoutes: Routes = [
  {path: 'login' , component: LoginComponent},
  {path: 'profile' , component: ProfileComponent},
  {path: 'home' , component: HomeComponent},
  {path: 'mycourse/:code' , component: MycourseComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToolbarComponent,
    ProfileComponent,
    HomeComponent,
    MycourseComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDialogModule,
    MatBadgeModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NoopAnimationsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp( environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [AuthenService, ProfileService, PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
