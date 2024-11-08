import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaMedicoPageRoutingModule } from './vista-medico-routing.module';

import { VistaMedicoPage } from './vista-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaMedicoPageRoutingModule
  ],
  declarations: [VistaMedicoPage]
})
export class VistaMedicoPageModule {}
