import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-pedido',
  templateUrl: './popover-pedido.component.html',
  styleUrls: ['./popover-pedido.component.scss'],
})
export class PopoverPedidoComponent implements OnInit {

  orden = '';

  constructor(
    private popoverCtrl: PopoverController
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
