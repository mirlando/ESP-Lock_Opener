import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImgService {

  constructor(private sanitazer: DomSanitizer) { }
  getImage(foto: any){
    return this.sanitazer.bypassSecurityTrustResourceUrl(foto);
  }
}
