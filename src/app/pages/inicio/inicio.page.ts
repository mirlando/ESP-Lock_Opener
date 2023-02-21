
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlojamientosComponent } from 'src/app/components/alojamientos/alojamientos.component';
import { AnularReservaComponent } from 'src/app/components/anular-reserva/anular-reserva.component';
import { MapsComponent } from 'src/app/components/maps/maps.component';
import { ReservarComponent } from 'src/app/components/reservar/reservar.component';
import { Alquiler, Apartamento, Usuario } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ImgService } from 'src/app/services/img.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  control = true;
  fechaLlegada: Date = new Date();
 
  fechaActual : Date = new Date();

  coleccionApartamentos: any = [{
    id: "",
    data: {} as Apartamento
   }]; 
   coleccionUsuarios: any = [{
    id: "",
    data: {} as Usuario
  }];
  coleccionAlquileres: any = [{
    id: "",
    data: {} as Alquiler
  }];
  apartamento: Apartamento;


  preview: any;

  constructor(private firestoreService: FirestoreService,
    private modalCtrl: ModalController,
    public img: ImgService,
    private alert: AlertService) {
      this.coleccionApartamentos = [];
      this.preview = [];
      this.coleccionUsuarios = []
      this.apartamento = {} as Apartamento
      this. coleccionAlquileres = [];
     }

  ngOnInit() {
    this.obtenerListaUsuarios();
    this.apartamentosDisponibles();
  } 
  ionViewWillEnter(){
    if (localStorage.getItem('rol') === 'user'){
    this.control=false;}else{
      this.control= true;
    }
  }

   apartamentosDisponibles(){
    this.firestoreService.consultarPorCampo('apartamentos','ESTADO','no ocupado').subscribe((consulta: any[]) => {
      this.coleccionApartamentos = [];
      console.log('dentro de resultadoConsulta');
      consulta.forEach((datos: any) => {
        this.coleccionApartamentos.push({
          id: datos.payload.doc.id,
          data: datos.payload.doc.data()
        });
        console.log(this.coleccionApartamentos);
        
      });
    });
    
  }
/**
 * permite identificar el tipo de rol del usuario
 */
  obtenerListaUsuarios(){
    this.firestoreService.consultar("usuarios").subscribe((consulta: any[]) => {
      this.coleccionUsuarios = [];
      consulta.forEach((datosTarea: any) => {
        this.coleccionUsuarios.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
        
      })
      this.coleccionUsuarios.forEach((element: any) => {
        if (element.data.UID === localStorage.getItem('uid')) {localStorage.setItem('rol',element.data.ROL)}                     
      });
    
    });
  }

  

  async reservar( id:string) {

    const modal = await this.modalCtrl.create({
      component: ReservarComponent,
      componentProps: {idApartamento: id, uid: localStorage.getItem('uid')}
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data);

  }
  async anular( id:string) {

    const modal = await this.modalCtrl.create({
      component: AnularReservaComponent,
      componentProps: {idApartamento: id, uid: localStorage.getItem('uid')}
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    //console.log(data);

  }


  apartamentoId(id: string, estado:string,) {

    this.firestoreService.consultarPorId('apartamentos', id).subscribe((resultado: any) => {
      if (resultado.exists) {
        this.apartamento = resultado.data()
        this.apartamento.ESTADO = estado;
        //this.alert.registerAlert('alerta',this.apartamento.ESTADO)
        this.firestoreService.actualizar('apartamentos', id, this.apartamento);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.alert.registerAlert('alerta', 'Apartamento no encontrado')
        this.apartamento = {} as Apartamento;
      }
    });

  }

  async nuevoSitio( ) {

    const modal = await this.modalCtrl.create({
      component: AlojamientosComponent,
      
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data);

  }

  async map(lat:any,lon:any){
    const modal = await this.modalCtrl.create({
      component: MapsComponent,
      componentProps: { lat: lat, lon: lon}
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data);
  }

}


