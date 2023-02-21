import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Apartamento, Cerradura } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InsertarCerradComponent } from '../insertar-cerrad/insertar-cerrad.component';

@Component({
  selector: 'app-cerraduras',
  templateUrl: './cerraduras.component.html',
  styleUrls: ['./cerraduras.component.scss'],
})
export class CerradurasComponent implements OnInit {

  coleccionCerraduras: any = [{
    id: "",
    data: {} as Cerradura
   }];
   

  constructor(private modalCtrl: ModalController, private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.obtenerListaCerraduras()
  }

  cerrar(){this.modalCtrl.dismiss();}

  async insertar() {

    const modal = await this.modalCtrl.create({
      component: InsertarCerradComponent,
      componentProps: { control: true}
    });
    await modal.present();

  }

  obtenerListaCerraduras(){
    console.log('dentro de obtener Lista');
    this.firestoreService.consultar("cerraduras").subscribe((consulta: any[]) => {
      this.coleccionCerraduras = [];
      console.log('dentro de resultadoConsulta');
      consulta.forEach((datos: any) => {
        this.coleccionCerraduras.push({
          id: datos.payload.doc.id,
          data: datos.payload.doc.data()
        });
         console.log(this.coleccionCerraduras);
        
      })
    });
  }

  borrar(activo: boolean, id: string) {
    if (!activo) {
      this.firestoreService.borrar('cerraduras', id);
      this.obtenerListaCerraduras();

    }

  }
  async actualizar(activo: boolean, id: string, codigoCerr: string) {

    console.log(activo,id,codigoCerr)

    /*const modal = await this.modalCtrl.create({
      component: InsertarCerradComponent,
      componentProps: { activo: activo, uid : id, codigo: codigoCerr, control: false}
    });*/

    this.modalCtrl.create({
      component: InsertarCerradComponent,
      componentProps: { activo: activo, uid : id, codigo: codigoCerr, control: false }
 }).then(async (modal) => {
      modal.onDidDismiss().then(() => {
          // se ejecuta al cerrar
          this.obtenerListaCerraduras();
      });
      await modal.present();
    });
    

  }

}