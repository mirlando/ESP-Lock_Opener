import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { ImgService } from 'src/app/services/img.service';
import { Geolocation } from '@capacitor/geolocation';
import { FormsModule } from '@angular/forms';
import { Apartamento, Cerradura } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-insertar-apart',
  templateUrl: './insertar-apart.component.html',
  styleUrls: ['./insertar-apart.component.scss'],
})
export class InsertarApartComponent implements OnInit {
  //variables
  id: any;
  id1: any;
  control: any;
  position: any;
  lat: any;
  lon: any;
  estado: any;
  idkey: any;
  idkey1: any;
  descripcion: any;
  direccion: any;
  fecha: any;
  hora: any;
  formtFecha: any;
  foto: any;
  preview: any;
  uid: any;
  codigo: any;
  codigocerr: any;

  //cerraduras
  coleccionCerraduras: any = [{
    id: "",
    data: {} as Cerradura
  }];
  coleccionCerraduras1: any = [{
    id: "",
    data: {} as Cerradura
  }];
  coleccionApartamentos: any = [{
    id: "",
    data: {} as Apartamento
  }];

  apartamento: Apartamento;
  cerradura: Cerradura;

  constructor(
    private modalCtrl: ModalController,
    public img: ImgService,
    private firestoreService: FirestoreService,
  ) {
    this.uid = localStorage.getItem('uid');
    this.apartamento = {} as Apartamento;
    this.cerradura = {} as Cerradura;
    this.coleccionCerraduras1 = [];
    this.coleccionApartamentos = [];





  }

  ngOnInit() {
    this.obtenerSitio();
    this.obtenerCerraduras();
    if (!this.control) {
      this.apartamentoId(this.id)
    }
  }

  /**
   * Obtener todas las cerraduras no ocupadas
   */

  obtenerCerraduras() {
    this.firestoreService.consultarPorCampo('cerraduras', 'ACTIVA', false).subscribe((consultaCerraduras: any[]) => {
      this.coleccionCerraduras = [];
      //console.log('dentro de resultadoConsulta');
      consultaCerraduras.forEach((datos: any) => {
        this.coleccionCerraduras.push({
          id: datos.payload.doc.id,
          data: datos.payload.doc.data()
        });
        console.log(this.coleccionCerraduras);

      })
    });


  }


  apartamentoId(id: any) {

    this.firestoreService.consultarPorId('apartamentos', id).subscribe((resultado) => {
      if (resultado.exists) {
        this.coleccionApartamentos.id1 = resultado.id
        this.coleccionApartamentos.data = resultado.data();
        this.descripcion = this.coleccionApartamentos.data.DESCRIPCION;
        this.direccion = this.coleccionApartamentos.data.DIRECCION;
        this.estado = this.coleccionApartamentos.data.ESTADO;
        this.preview = this.img.getImage(this.coleccionApartamentos.data.IMG);
        this.foto = this.coleccionApartamentos.data.IMG;
        this.idkey1 = this.coleccionApartamentos.data.IDKEY;
        this.idkey = ' ';
        this.lat = this.coleccionApartamentos.data.LAT;
        this.lon = this.coleccionApartamentos.data.LON;
        console.log(this.idkey1);

      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.coleccionApartamentos.data = {} as Apartamento;
      }
    });

  }

  cerraduraPorId(id: string) {
    this.firestoreService.consultarPorId('cerraduras', id).subscribe((resultado) => {
      if (resultado.exists) {
        this.coleccionCerraduras1.id = resultado.id
        this.coleccionCerraduras1.data = resultado.data();
        this.cerradura.ACTIVA = !this.coleccionCerraduras1.data.ACTIVA;
        this.cerradura.CODIGO = this.coleccionCerraduras1.data.CODIGO;
        //console.log('cerradura.... ' + this.cerradura.ACTIVA, 'cerradura.... ' + this.cerradura.CODIGO)
        this.firestoreService.actualizar('cerraduras', id, this.cerradura);

      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.coleccionCerraduras1.data = {} as Cerradura;
      }
    });

  }



  /**
   * Mostrar foto
   */
  async sacarFoto() {
    try {

      const profilePicture = await Camera.getPhoto({
        quality: 100,
        height: 400,
        width: 600,
        allowEditing: false,
        saveToGallery: true,
        resultType: CameraResultType.Base64,
      });
      this.foto = 'data:image/png;base64,' + profilePicture.base64String;
      this.preview = this.img.getImage(this.foto);
    } catch (error) {
      console.error('error en cath' + error);
    }
  }

  /**
   * Obtener sitio
   */
  async obtenerSitio() {
    this.position = await Geolocation.getCurrentPosition();
    console.log('latitud: ' + this.position.coords.latitude, 'longitud: ' + this.position.coords.longitude);
    this.lat = this.position.coords.latitude;
    this.lon = this.position.coords.longitude;
  }
  /**
   * Insertar cerradura
   */

  insertar() {
    this.apartamento = {
      LAT: this.lat,
      LON: this.lon,
      DESCRIPCION: this.descripcion,
      DIRECCION: this.direccion,
      ESTADO: this.estado,
      IDKEY: this.idkey,
      IMG: this.foto,
    };
    this.cerraduraPorId(this.idkey);
    this.firestoreService.insertar("apartamentos", this.apartamento).then(() => {
      console.log('Tarea creada correctamente!');
      this.apartamento = {} as Apartamento;
    }, (error) => {
      console.error('Error al insertar: ' + error);
    })
    this.cerrar();

  }
  /**
   * Actualización o cambio de Apartamento
   */
  actualizar() {

    if (this.idkey === ' ') {
      this.idkey = this.idkey1;
    } else {
      this.cerraduraPorId(this.idkey)
      this.cerraduraPorId(this.idkey1)
    }

    this.apartamento = {
      LAT: this.lat,
      LON: this.lon,
      DESCRIPCION: this.descripcion,
      DIRECCION: this.direccion,
      ESTADO: this.estado,
      IDKEY: this.idkey,
      IMG: this.foto,
    };
    this.firestoreService.actualizar('apartamentos', this.id, this.apartamento);
    this.cerrar();

  }

  cerrar() { this.modalCtrl.dismiss(); }



}


