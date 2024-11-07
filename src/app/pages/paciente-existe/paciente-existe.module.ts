import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PacienteExistePageRoutingModule } from './paciente-existe-routing.module';

import { PacienteExistePage } from './paciente-existe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PacienteExistePageRoutingModule
  ],
  declarations: [PacienteExistePage]
})
export class PacienteExistePageModule {}
