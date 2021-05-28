import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PopoverInfoComponent } from './popover-info/popover-info.component';
import { PopoverProductoComponent } from './popover-producto/popover-producto.component';
import { PopoverPedidoComponent } from './popover-pedido/popover-pedido.component';



@NgModule({
  declarations: [
    PopoverInfoComponent,
    PopoverProductoComponent,
    PopoverPedidoComponent,
  ],
  exports: [
    PopoverInfoComponent,
    PopoverProductoComponent,
    PopoverPedidoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class ComponentsModule { }

