import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  //Indicamos que vamos a recibir en el header una entrada que
  //será una string con el título
  @Input() titulo: string | undefined;

  constructor() { }

  ngOnInit() { }

}
