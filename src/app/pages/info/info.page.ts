import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Ayuda } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { AyudaService } from 'src/app/services/ayuda.service';

const mensaje: string = 'Desarrolladores:<br><br>Jesús Medina Naranjo<br>Aythami Déniz Morales<br><br>3º de Desarrollo de Aplicaciones Multiplataforma';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})

export class InfoPage implements OnInit {

  @ViewChild('lista') lista : IonList | undefined;
  ayudas: Observable<Ayuda []> | undefined ;


  constructor(
    private alert: AlertService,
    private ayudaService: AyudaService,
    ) {
       
     }
  

  ngOnInit() {
   // this.ayudas = this.ayudaService.getAyudas();
   this.ayudas = this.ayudaService.getAyudas();
  }

  info() {
    this.alert.infoAlert('Acerca de...', 'ESP-Lock Opener V-1.0.0', mensaje)
  }

  mostrarAyuda(name: any, message: any) {
    console.log('Mostramos la ayuda de los iconos');
    this.alert.infoAlert(name, '', message);
  }


}