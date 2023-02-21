import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { isNull } from 'util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registro: Usuario | undefined;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private alert: AlertService,
    private auth: AngularFireAuth,
    private firestoreService: FirestoreService
  ) {
    this.registerForm= {} as FormGroup;
    this.registro = {} as Usuario;
    
   }

  ngOnInit() {
    this.registerForm = this.fb.group({
      //name: ['', Validators.required,],
      // eslint-disable-next-line max-len
      mail: ['', Validators.required,],
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    });

  }

  register() {
    const user = {
      email: this.registerForm.controls['mail'].value,
      password: this.registerForm.controls['password'].value
    };
    if (this.registerForm.status == 'VALID') {
      if (user.password === this.registerForm.controls['confirm'].value) {
        this.registro={ EMAIL: '',ROL: 'user',UID: ''}
        
        this.auth.createUserWithEmailAndPassword(user.email, user.password)
          .then(userData => {
           
            this.registro={ EMAIL: userData.user?.email!,ROL: 'user',UID: userData.user?.uid!}
            

            this.alert.registerAlert('Success', 'El usuario a sido creado correctamente');
            //this.db.database.ref('user/' + userData.user.uid).set(this.registerForm.value);

            this.firestoreService.insertar("usuarios", this.registro).then(() => {
              console.log('Tarea creada correctamente!');
              //this.cerraduraEditando = {} as Cerradura;
            }, (error) => {
              console.error(error);
            });
            this.cerrar()
            console.log(userData);
          }).catch(e => {
            console.log(e);
            // eslint-disable-next-line max-len
            this.alert.registerAlert('¡Error!', this.error(e));

          });
      } else {
        this.alert.registerAlert('¡Error!', 'Las contraseñas no coinciden');
      }
    } else {
      this.alert.registerAlert('¡Error!', 'Hay algún campo vacío');
    }
  }
    
  cerrar(){this.modalCtrl.dismiss();}

  /**
   * Errores
   */
  error(e: string){
    // eslint-disable-next-line max-len
    if (e == 'FirebaseError: Firebase: A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).')
     { e = 'Fallo de red, error en la conexión'; }
    if (e == 'FirebaseError: Firebase: The email address is badly formatted. (auth/invalid-email).')
     { e = 'El mail no es correcto'; }
    // eslint-disable-next-line max-len
    if (e == 'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).')
     { e = 'La password no cumple la regla de al menos seis carácteres'; }
     return e;

  }

}
