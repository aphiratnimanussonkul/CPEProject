import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCardModule, MatInputModule, MatListModule, MatToolbarModule, MatTableModule,
MatSidenavModule, MatCheckboxModule, MatDialogModule, MatTreeModule, MatProgressBarModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';

import { HomeComponent } from './home/home.component';
import { PostService } from './service/post.service';
import { MycourseComponent } from './mycourse/mycourse.component';
import { SearchCourseComponent } from './search-course/search-course.component';
import { MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';

const appRoutes: Routes = [
  {path: 'home/:email' , component: HomeComponent},
  {path: 'mycourse/:email/:code' , component: MycourseComponent},
  {path: 'search/:code' , component: SearchCourseComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MycourseComponent,
    SearchCourseComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule,
    MatTreeModule,
    MatProgressBarModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyAS9Y5HsByA2leqctQkuVnANVpR8hS7vEY',
      authDomain: 'cpeproject.firebaseapp.com',
      storageBucket: 'cpeproject.appspot.com',
      projectId: 'cpeproject',
    }),
    AngularFireStorageModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
