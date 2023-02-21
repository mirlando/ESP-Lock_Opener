import { Injectable } from '@angular/core';
import { AngularFirestore, fromCollectionRef } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }
  //insertar
  public insertar(coleccion: any, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  } 

  public consultar(coleccion:any) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion: string, documentId: string ) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion: string, documentId: string, datos: any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
   }

   public consultarPorId(coleccion: string, documentId: string) {
    console.log ('Coleccion '+ coleccion+ 'Id '+documentId)
    return this.angularFirestore.collection(coleccion).doc(documentId).get();

  }

  /**
  this.comments$ = afs.collection('Comments', ref => ref.where('user', '==', userId))
                      .snapshotChanges();
 */
  public consultarPorCampo (coleccion:string, campo: string, predicado:any) {
    console.log('servicio consulta por campo '+coleccion+' '+ campo+' '+predicado);
    return this.angularFirestore.collection(coleccion, ref => ref.where(campo, '==' ,predicado)).snapshotChanges();
  }
  public consultarPorCampoGet (coleccion:string, campo: string, predicado:any) {
    console.log('servicio consulta por campo '+coleccion+' '+ campo+' '+predicado);
    return this.angularFirestore.collection(coleccion, ref => ref.where(campo, '==' ,predicado)).get();
  }
 
 

}


