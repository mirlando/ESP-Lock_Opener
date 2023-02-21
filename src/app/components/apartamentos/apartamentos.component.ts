import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Apartamento, Cerradura } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InsertarApartComponent } from '../insertar-apart/insertar-apart.component';

@Component({
  selector: 'app-apartamentos',
  templateUrl: './apartamentos.component.html',
  styleUrls: ['./apartamentos.component.scss'],
})
export class ApartamentosComponent implements OnInit {
  codigo: any;
  activa: any;

  coleccionApartamentos: any = [{
    id: "",
    data: {} as Apartamento
  }];
  coleccionCerraduras: any = [{
    id: "",
    data: {} as Cerradura
  }];

  apartamento: Apartamento;
  cerradura: Cerradura;


  constructor(private modalCtrl: ModalController, private firestoreService: FirestoreService) {
    this.apartamento = {} as Apartamento;
    this.cerradura = {} as Cerradura;
  }

  ngOnInit() {
    this.obtenerListaApartamentos();


  }

  cerrar() { this.modalCtrl.dismiss(); }

  obtenerListaApartamentos() {
    console.log('dentro de obtener Lista');
    this.firestoreService.consultar("apartamentos").subscribe((Consulta: any[]) => {
      this.coleccionApartamentos = [];
      console.log('dentro de resultadoConsulta');
      Consulta.forEach((datosTarea: any) => {
        this.coleccionApartamentos.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
        console.log(this.coleccionApartamentos);

      })
    });
  }

  obtenerIdCerraduras(id: string, coleccion: string) {
    this.firestoreService.consultarPorId(coleccion, id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if (resultado.exists) {
        this.coleccionCerraduras.data = resultado.data();
        this.cerradura.CODIGO = this.coleccionCerraduras.data.CODIGO;
        this.cerradura.ACTIVA = !this.coleccionCerraduras.data.ACTIVA;
        console.log(this.cerradura)
        this.firestoreService.actualizar('cerraduras', id, this.cerradura);
      }

    });

  }

  ///Insertar o actualizar un nuevo apartamento
  async insertar() {

    const modal = await this.modalCtrl.create({
      component: InsertarApartComponent,
      componentProps: { control: true }
    });
    await modal.present();

  }
  async actualizar(id: string) {

    const modal = await this.modalCtrl.create({
      component: InsertarApartComponent,
      componentProps: { control: false, id: id }
    });
    await modal.present();


  }

  borrar(id: string, activo: string, idkey: string) {
    if (activo === 'no ocupado') {
      this.obtenerIdCerraduras(idkey, 'cerraduras');
      this.firestoreService.borrar('apartamentos', id);
      this.obtenerListaApartamentos();

    }

  }




}

