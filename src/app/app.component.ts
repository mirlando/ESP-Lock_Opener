import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Usuario } from './interfaces/interfaces';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  coleccionUsuarios: any = [{
    id: "",
    data: {} as Usuario
  }];
  usuario = {} as Usuario;
  rol:any;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    
  ) { 
    {}
  }
  ngOnInit(): void {
    //this.verifyCurrentUser();
  }
  async verifyCurrentUser() {
    this.auth.authState.subscribe((e: any)=>{
     // console.log('app component : '+e);
      if (e==null){
        localStorage.setItem('uid', 'noexiste');
      }else{
        //this.user.setUid(e.uid);
        localStorage.setItem('uid', e.uid);

        //this.router.navigate(['/'],{replaceUrl:true});
        this.router.navigate(['/tabs/inicio']);
      }
    });
   console.log('app component uid: '+(localStorage.getItem('uid')));

  }
}
