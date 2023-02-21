import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ok } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) { }

  async registerAlert(status: string, sms: string) {
    const alert = await this.alertCtrl.create({
      header: status,
      subHeader: sms,
      mode: 'ios',
      buttons: ['Listo']
    });

    await alert.present();
  }

  async infoAlert(status: string, sms: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: status,
      subHeader: sms,
      message: mensaje,
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
  }
}
