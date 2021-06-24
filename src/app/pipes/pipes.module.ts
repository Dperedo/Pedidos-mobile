import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonedaPipe } from './moneda.pipe';



@NgModule({
  declarations: [
    MonedaPipe
  ],
  exports: [
    MonedaPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
