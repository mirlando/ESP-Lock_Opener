import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { menuOpts } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MenuOptsService {
  

  constructor(private http: HttpClient) { }

  getMenuOptions(rol:string) {
        return this.http.get<menuOpts[]>('/assets/data/menu.json');
    
  }

}
