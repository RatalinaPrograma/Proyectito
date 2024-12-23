import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { AgregarPacientesPage } from './agregar-pacientes.page';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgregarPacientesPageRoutingModule } from './agregar-pacientes-routing.module';

@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarPacientesPageRoutingModule
  ],
  declarations: [AgregarPacientesPage]
})
export class AgregarPacientesPageModule { }
