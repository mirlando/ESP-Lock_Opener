import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  rol='';
  coleccionUsuarios: any = [{
    id: "",
    data: {} as Usuario
  }];
  coleccionUsuarios1: any = [{
    id: "",
    data: {} as Usuario
  }];

  usuario:Usuario;
  uid:string [];
  constructor(
    private modalCtrl: ModalController,
    private firestoreService:FirestoreService,
    private auth: AngularFireAuth
  ) {
    this.coleccionUsuarios = [];
    this.coleccionUsuarios1= [];
    this.usuario ={EMAIL:'',ROL:'',UID:''};
    this.uid = [];
   }

   ngOnInit() {
    this.obtenerListaUsuarios();

   }

   cambiarRol(id:string){
    //console.log(id)
    this.coleccionUsuarios1=this.coleccionUsuarios.filter((element:{id: string})=>{
      return element.id===id;
    })
    this.usuario= this.coleccionUsuarios1[0].data;
    if(this.usuario.ROL=='user'){
      this.usuario.ROL = 'admin'
    }else{
      this.usuario.ROL = 'user'
    }
      this.firestoreService.actualizar("usuarios", id, this.usuario);
   }

  cerrar(){this.modalCtrl.dismiss();}

  obtenerListaUsuarios() {
    //console.log('dentro de obtener Lista');
    this.firestoreService.consultar("usuarios").subscribe((Consulta: any[]) => {
      this.coleccionUsuarios = [];
      //console.log('dentro de resultadoConsulta');
      Consulta.forEach((datosTarea: any) => {
        this.coleccionUsuarios.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
        
        console.log(this.coleccionUsuarios);

      })
    });
  }
 

  borrarUsuario(id:string,uid: string){
    

  }
  

}
