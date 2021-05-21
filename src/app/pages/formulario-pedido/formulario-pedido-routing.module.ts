import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioPedidoPage } from './formulario-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioPedidoPageRoutingModule {}
