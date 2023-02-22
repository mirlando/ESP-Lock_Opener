import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ayuda } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AyudaService {

  constructor(private http: HttpClient) { }

  getAyudas(){
    return this.http.get<Ayuda[]>('/assets/data/ayuda.json');
  }
}
