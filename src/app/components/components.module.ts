import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PopoverInfoComponent } from './popover-info/popover-info.component';



@NgModule({
  declarations: [
    PopoverInfoComponent,
  ],
  exports: [
    PopoverInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class ComponentsModule { }

