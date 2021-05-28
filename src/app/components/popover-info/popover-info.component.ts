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
    //private cliente: ClientePage
    ) { 
      //console.log(this.cliente.orden);
      this.orden = localStorage.getItem('orden');
    }

  ngOnInit() {}

  ordenBy( ordenPor: string ) {
    this.orden = ordenPor;
    console.log('orden: '+this.orden);
    
    this.popoverCtrl.dismiss({
      item: ordenPor
    });

  }

  /*ordenBy(ordenPor: string) {
    this.orden = ordenPor;
    console.log(this.orden);
    //this.listadoCliente();
  }*/

}
