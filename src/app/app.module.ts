import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from '../environments/firebase.environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { MovieDetailsPageComponent } from './components/movie-details-page/movie-details-page.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HasWatchedComponent } from './components/has-watched/has-watched.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { RegisterComponent } from './components/register/register.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SearchBarComponent,
    SearchPageComponent,
    MovieDetailsPageComponent,
    SafeUrlPipe,
    HasWatchedComponent,
    WatchlistComponent,
    RegisterComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    MaterialModule,
    CommonModule,
    AngularFireAuthModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextFieldModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
