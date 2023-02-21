import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApartamentosComponent } from 'src/app/components/apartamentos/apartamentos.component';
import { CerradurasComponent } from 'src/app/components/cerraduras/cerraduras.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  control = true;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if(localStorage.getItem('rol') ==='admin'){
      this.control=false;}
  }
  async apartamentos(){
    const modal = await this.modalCtrl.create({
      component: ApartamentosComponent
    });
    await modal.present();
    //console.log('presenta apartamento')
  }

  async cerraduras(){

    const modal = await this.modalCtrl.create({
      component: CerradurasComponent
    });
    await modal.present();
    //console.log('presenta cerraduras')

  }
  async usuarios(){

    const modal = await this.modalCtrl.create({
      component: UsuariosComponent
    });
    await modal.present();
    //console.log('presenta cerraduras')

  }

}
