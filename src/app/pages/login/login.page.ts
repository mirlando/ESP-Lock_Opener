import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { Usuario } from 'src/app/interfaces/interfaces';

import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup ;
  coleccionUsuarios: any = [{
    id: "",
    data: {} as Usuario
  }];

  constructor(
    private auth: AngularFireAuth,
    private fb: FormBuilder,
    private alert: AlertService,
    private firestoreService: FirestoreService,
    private modalCtrl: ModalController,
    private router: Router
  ) { 
    this.loginForm= {} as FormGroup;
  }
  
  ionViewDidLeave(){ }

  ngOnInit() {

    this.loginForm=this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    this.auth.signInWithEmailAndPassword(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value,
    ).then(()=>{
      this.loginForm.reset();
      this.alert.registerAlert('Alerta','Correctamente logeado');
     
    }).catch (
      async (err: string) =>{

          
          this.alert.registerAlert('Alerta',this.error(err));
      });
      this.crearRol();
      
}
crearRol(){
  this.auth.authState.subscribe((e: any)=>{
    if (e==null){
      localStorage.setItem('uid', 'no existe'); 
      }else{
      localStorage.setItem('uid', e.uid);
      console.log('CrearlRol Uid '+localStorage.getItem('uid'))
       }
  });

  console.log('crear rol'+localStorage.getItem('uid'))
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

   // console.log('Rol Usuario es '+localStorage.getItem('rol'))
  
  });
}

logout(){
  this.auth.signOut();//pemite cerrar el acceso a la based e datos
  localStorage.setItem('rol','');
  this.router.navigate(['tabs'],{replaceUrl:true});
  localStorage.setItem('uid', 'noexiste')
  
}

async register() {

  const modal = await this.modalCtrl.create({
    component: RegisterComponent,
  });

  await modal.present();

  /*const { data } = await modal.onWillDismiss();
  console.log(data);*/

}

cerrar(){
  App.exitApp();
}

error(err: string){
  if (err=='FirebaseError: Firebase: The email address is badly formatted. (auth/invalid-email).')
      {
        err='El campo mail no está correctamente formado';
      }
      // eslint-disable-next-line eqeqeq
  if (err=='FirebaseError: Firebase: An internal AuthError has occurred. (auth/internal-error).')
      {
        err='No se ha introducido ninguna contraseña';
      }

      // eslint-disable-next-line max-len
  if (err=='FirebaseError: Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).')
      {
        err='No se ha encontrado el usuario o éste ha sido eliminado';
      }
      // eslint-disable-next-line max-len
  if (err=='FirebaseError: Firebase: A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).')
      {
        err='Error de red hay un fallo en la conexión';
      }
  return err;
}

}

