import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { menuOpts, Usuario } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuOptsService } from 'src/app/services/menu-opts.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  rol = '' ;
  uid ='';
  coleccionUsuarios: any = [{
    id: "",
    data: {} as Usuario
  }];
  opcionesMenu: Observable<menuOpts[]> | undefined;

  constructor(
    private menuOptsService: MenuOptsService,
    private firestoreService: FirestoreService
    ) {}

  ngOnInit() {
    this.obtenerListaUsuarios()
   // this.comprobarRol()
    this.opcionesMenu = this.menuOptsService.getMenuOptions(localStorage.getItem('rol')!);
  }
  obtenerListaUsuarios(){
    console.log('dentro de obtener Lista  '+localStorage.getItem('uid'));
    this.firestoreService.consultar("usuarios").subscribe((consulta: any[]) => {
      this.coleccionUsuarios = [];
      console.log('dentro de resultadoConsulta');
      consulta.forEach((datosTarea: any) => {
        this.coleccionUsuarios.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
         //console.log(this.coleccionUsuarios);
        
      })
      //console.log('obtener lista usuario  '+this.coleccionUsuarios[0].data.ROL);
      this.coleccionUsuarios.forEach((element: any) => {
        if (element.data.UID === localStorage.getItem('uid')) {localStorage.setItem('rol',element.data.ROL)}                     
      });

      console.log('Rol Usuario es '+localStorage.getItem('rol'))
    
    });
    console.log('Rol Usuario es '+localStorage.getItem('rol'))
  }
  }

