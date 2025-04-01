import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
})
export class MenuCardComponent implements OnInit {

  @Input()
  imagen!: string;
  @Input()
  titulo!: string;
  @Input()
  contenido!: string;

  constructor() { }

  ngOnInit() {}

}
