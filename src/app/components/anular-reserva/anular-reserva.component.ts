import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Alquiler } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-anular-reserva',
  templateUrl: './anular-reserva.component.html',
  styleUrls: ['./anular-reserva.component.scss'],
})
export class AnularReservaComponent implements OnInit {

  uid = '';
  idApartamento = '';
  coleccionAlquileres: any = [{
    id: "",
    data: {} as Alquiler,
  }];
  coleccionAlquileres1: any = [{
    id: "",
    data: {} as Alquiler,
  }];

  constructor(
    private modalCtrl: ModalController,
    private firestoreService: FirestoreService,
    private alert: AlertService,
  ) {
    this.coleccionAlquileres = [];
    this.coleccionAlquileres1 = [];
   }

  ngOnInit() {
 this.alquileres()
  }

  //ionViewWillEnter(){this.alquileres()}

  cerrar(){this.modalCtrl.dismiss();}

  alquileres(){
    this.firestoreService.consultar('alquileres').subscribe((consulta: any[]) => {
      this.coleccionAlquileres = [];
     //console.log('dentro de resultadoConsulta');
      consulta.forEach((datos: any) => {
       // console.log('foreach');
        this.coleccionAlquileres.push({
          id: datos.payload.doc.id,
          data: datos.payload.doc.data()
        });
        // console.log('Colección de alquileres '+this.coleccionAlquileres);

      });
      this.coleccionAlquileres1 = this.coleccionAlquileres.filter((element: { data: { IDPROP: string; F_INICIO: any; UID:string }} ) => {
        return element.data.IDPROP === this.idApartamento  && element.data.UID == this.uid;
      });

      
    });

    

  }

 borrar(id:string){
  this.firestoreService.borrar('alquileres', id).then(()=>{
    this.alert.registerAlert('Nota','Ha borrado correctamente su reserva');
  }).catch(()=>{
    this.alert.registerAlert('Alerta','Se ha producido un error al borrar su reserva');
  });
  
 }

}
