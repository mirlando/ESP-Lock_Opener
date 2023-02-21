import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cerradura } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-insertar-cerrad',
  templateUrl: './insertar-cerrad.component.html',
  styleUrls: ['./insertar-cerrad.component.scss'],
})
export class InsertarCerradComponent implements OnInit {
  activa: any;
  code= '';
  control:any;
  codigo:any;
  uid: any;
  activo:any;

  cerraduraEditando: Cerradura;

  constructor
  (private modalCtrl: ModalController, 
    private firestoreService: FirestoreService)
     { 
    this.cerraduraEditando = {} as Cerradura;

  }

  ngOnInit() {
    //console.log(this.activo, this.uid, this.codigo, this.control);
    if (this.activo){
    this.activa = this.activo;
  }else{
    this.activa = 'false';
  }
    this.code = this.codigo;
  }

  cerrar(){this.modalCtrl.dismiss();}

  
  insertar() {
    this.cerraduraEditando.ACTIVA = false;
    this.cerraduraEditando.CODIGO = this.code;
    this.firestoreService.insertar("cerraduras", this.cerraduraEditando).then(() => {
      console.log('Tarea creada correctamente!');
      this.cerraduraEditando = {} as Cerradura;
    }, (error) => {
      console.error(error);
    });
  }

  actualizar(){
    if(this.activa==='true'){
      this.cerraduraEditando.ACTIVA = true
    } else{
      this.cerraduraEditando.ACTIVA = false
    }
    this.cerraduraEditando.CODIGO = this.code;
    this.firestoreService.actualizar("cerraduras", this.uid, this.cerraduraEditando);
    this.cerrar();
    
  }

}
