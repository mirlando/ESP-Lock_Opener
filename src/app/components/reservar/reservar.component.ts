import { formatDate, NgFor } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Alquiler, Apartamento, DaysConfig } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss'],
})
export class ReservarComponent implements OnInit {
  /**
   * calendario
   *
  date!: string;
  dateRange!: { from: string; to: string; };
  type!: 'string';

  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };
  optionsRange: CalendarComponentOptions = {
    monthFormat: 'YYYY MMMM  ',
    weekdays: ['Dom', 'Lun', 'Mar', 'Miér', 'Jue', 'Vier', 'Sáb'],
    monthPickerFormat: ['Ene','Febr','Mar','Abr','May','jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    weekStart: 1,
    daysConfig: [{date: new Date(2023,2,10) , title:'X', cssClass: 'myCal', marked: true, disable: true}]
  };
/**
 * ****************************************
 */
  texto!: string;
  texto1!: string;
  //daysConfig!: DaysConfig;
  // arrayDaysConfig: DaysConfig[]
  fechaActual: Date = new Date();
  apartamento: Apartamento;
  fechaLlegada: Date;
  fechasOcupadas!: string;
  fechasOcupadas1!: string[];
  fechasOcupadas2!: string[];
  fechasOcupadas3!: string[];

  uid: string = '';
  idApartamento: string = '';
  registrarAlquiler: Alquiler;

  coleccionAlquileres: any = [{
    id: "",
    data: {} as Alquiler,
  }];

  constructor(
    private modalCtrl: ModalController,
    private firestoreService: FirestoreService,
    private alert: AlertService,
    @Inject(LOCALE_ID) private locale: string,


  ) {
    this.registrarAlquiler = {} as Alquiler;
    this.fechaLlegada = new Date();
    //this.arrayDaysConfig = [];
    this.apartamento = {} as Apartamento;
    this.texto = '';
    this.fechasOcupadas1 = [];
    this.fechasOcupadas2 = [];
    this.fechasOcupadas3 = [];
    //this.daysConfig = {} as DaysConfig;
    //this.arrayDaysConfig = []
  }
  ngOnInit() {
    this.Ocupadas();
  }

  llegada(event: any) {
    this.fechaLlegada = event.detail.value;
    //console.log(this.fechaLlegada);
  }

  ionViewWillEnter() {
    this.funFechasOcupadas();
  }

  /**
   * Método que cierra el modal y envía como argumentos los datos de la reserva
   */


  reservado() {
    this.texto1 = '';
    console.log(this.fechaLlegada.toString());
    this.fechasOcupadas3 = this.fechaLlegada.toString().split(',');
    console.log(this.fechasOcupadas3);

    for (let i = 0; i < this.fechasOcupadas3.length; i++) {
      if (this.fechasOcupadas2.includes(this.fechasOcupadas3[i])) {
        this.texto1 = this.texto1 + ', ' + this.fechasOcupadas3[i];
      }
    }
    console.log('texto1 ' + this.texto1)
    if (this.texto1 == '') {
      
      if (this.fechaLlegada != null) {
        //this.alert.registerAlert('alerta', 'Fecha correcta');
        this.registrarAlquiler = { F_INICIO: this.fechaLlegada, IDPROP: this.idApartamento, UID: this.uid }


        this.firestoreService.insertar("alquileres", this.registrarAlquiler).then(() => {
          this.registrarAlquiler = {} as Alquiler;
          this.alert.registerAlert('alerta', 'Alquiler insertado');
        }, (error) => {
          this.alert.registerAlert('alerta', 'Error al insertar: ' + error);
          //console.error('Error al insertar: ' + error);
        })


        this.modalCtrl.dismiss();
      } else {
        this.alert.registerAlert('alerta', 'La fecha de salida es menor que la de entrada o algún campo es null ');
      }
    } else {
      this.alert.registerAlert('ALERTA', 'Las siguentes fechas están ocupadas' + '\n' + this.texto1)
    }
  }


  /**
   * Método que cierra el modal sin haber reservado
   */

  cancelado() {
    this.modalCtrl.dismiss();
  }

  /**
   * fechas ocupadas
   */
  Ocupadas() {

    this.firestoreService.consultar('alquileres').subscribe((consulta: any[]) => {
      this.coleccionAlquileres = [];
      console.log('dentro de resultadoConsulta');
      consulta.forEach((datos: any) => {
        this.coleccionAlquileres.push({
          id: datos.payload.doc.id,
          data: datos.payload.doc.data()
        });
        // console.log('fechas1'+this.coleccionAlquileres);

      });
      const filtro = this.coleccionAlquileres.filter((element: { data: { IDPROP: string; F_INICIO: any; }; }) => {
        return element.data.IDPROP === this.idApartamento;
      });
      const fechasOcupadas = filtro.map((element: { data: { F_INICIO: any; }; }) => element.data.F_INICIO);
      this.texto = fechasOcupadas.toString();
      console.log('string textoOcupadas ' + this.texto)
    });

  }
  /**
   * Permite ver las fechas ordenadas que están ocupadas
   */
  funFechasOcupadas() {
    //console.log( 'fechas ocupadas ' + this.texto)
    this.fechasOcupadas1 = this.texto.split(',');
    const date = new Date()
    this.fechasOcupadas2 = [];
    for (let i = 0; i < this.fechasOcupadas1.length; i++) {
      const date1 = new Date(this.fechasOcupadas1[i]);
      if (date < date1) {
        this.fechasOcupadas2.push(this.fechasOcupadas1[i])
      }
    }
    this.fechasOcupadas2.sort();
  }

  // Selected date reange and hence title changed


}