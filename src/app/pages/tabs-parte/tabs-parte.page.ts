import { Component, OnInit } from '@angular/core';
import { TabService } from 'src/app/services/tab_service';

@Component({
  selector: 'app-tabs-parte',
  templateUrl: './tabs-parte.page.html',
  styleUrls: ['./tabs-parte.page.scss'],
})
export class TabsPartePage implements OnInit {

  states: { [s: string]: any } = {};
  constructor(
    private tabStateService: TabService
  ) { }

  ngOnInit() {
   //this.tabStateService.setState("info-parte", false);
  }

  activa(tab: any, opcion: any){
    //this.tabStateService.setState(tab, false)
  }
}
