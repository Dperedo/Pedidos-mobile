import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-producto',
  templateUrl: './popover-producto.component.html',
  styleUrls: ['./popover-producto.component.scss'],
})
export class PopoverProductoComponent implements OnInit {

  
  orden = '';

  constructor(
    private popoverCtrl: PopoverController
    ) { 
      this.orden = localStorage.getItem('orden');
    }

  ngOnInit() {}

  ordenBy( ordenPor: string ) {
    this.orden = ordenPor;
    //console.log('orden: '+this.orden);
    
    this.popoverCtrl.dismiss({
      item: ordenPor
    });

  }

}
