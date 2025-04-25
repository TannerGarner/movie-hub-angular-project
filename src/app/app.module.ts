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
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
