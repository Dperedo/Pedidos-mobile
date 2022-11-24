import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ClientePage } from '../../pages/cliente/cliente.page';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  lista: string;
  orden = '';
  items = Array(7);

  constructor(
    private popoverCtrl: PopoverController,
    ) { 
      this.orden = localStorage.getItem('orden');
    }

  ngOnInit() {}

  ordenBy( ordenPor: string ) {
    this.orden = ordenPor;

    this.popoverCtrl.dismiss({
      item: ordenPor
    });

  }

}
