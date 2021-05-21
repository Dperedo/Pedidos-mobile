import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioClientePageRoutingModule } from './formulario-cliente-routing.module';

import { FormularioClientePage } from './formulario-cliente.page';
import { ClientePage } from '../cliente/cliente.page';
import { ClientePageRoutingModule } from '../cliente/cliente-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioClientePageRoutingModule
  ],
  declarations: [FormularioClientePage]
})
export class FormularioClientePageModule {}
