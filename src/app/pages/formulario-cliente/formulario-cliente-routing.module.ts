import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioClientePage } from './formulario-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioClientePageRoutingModule {}
