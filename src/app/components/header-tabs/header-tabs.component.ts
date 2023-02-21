import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss'],
})
export class HeaderTabsComponent implements OnInit {

  //Indicamos que vamos a recibir en el header una entrada que
  //será una string con el título
  @Input() titulo: string | undefined;

  constructor() { }

  ngOnInit() { }

}
