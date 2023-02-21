import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

const mensaje: string = 'Desarrolladores:<br><br>Jesús Medina Naranjo<br>Aythami Déniz Morales<br><br>3º de Desarrollo de Aplicaciones Multiplataforma';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})

export class InfoPage implements OnInit {

  constructor(private alert: AlertService) { }


  ngOnInit() {
  }

  info() {
    this.alert.infoAlert('Acerca de...', 'ESP-Lock Opener V-1.0.0', mensaje)
  }

}