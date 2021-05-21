import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioPedidoPageRoutingModule } from './formulario-pedido-routing.module';

import { FormularioPedidoPage } from './formulario-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioPedidoPageRoutingModule
  ],
  declarations: [FormularioPedidoPage]
})
export class FormularioPedidoPageModule {}
