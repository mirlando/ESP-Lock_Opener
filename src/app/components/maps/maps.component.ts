import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';// Importamos L de leaflet para renderizar el mapa.


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  lon:any;
  lat:any;
  map: L.Map | undefined;
  center:L.PointTuple | undefined;
  miMarker:L.Icon = new L.Icon({ iconUrl: 'assets/img/coordenada.png', iconsize: [48, 48], iconAnchor:[24, 43] })

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    
  }
  ionViewDidEnter(){
    this.center=[this.lat,this.lon];
    this.map = L.map('mapId').setView(this.center, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    L.marker(this.center, {icon: this.miMarker}).addTo(this.map)
    .bindPopup('Lugar de destino.')
    .openPopup();
        
  }
 
  cerrar(){this.modalCtrl.dismiss();}

}
