import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';

import{AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FirestoreService } from './services/firestore.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ImgService } from './services/img.service';
import { CommonModule } from '@angular/common';
//import { CalendarModule } from 'ion2-calendar';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';




@NgModule({
  //Al usar la página de reservar en el calendario en un Modal tenemos que declararlo
  declarations: [AppComponent,],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    

    
    
  ],
  providers: [{ 
   
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy },
    BLE, 
    FirestoreService,
    ImgService,
    {provide: LOCALE_ID, useValue: 'es-ES'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
