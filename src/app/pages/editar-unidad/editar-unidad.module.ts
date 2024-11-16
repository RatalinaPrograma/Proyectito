import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarUnidadPageRoutingModule } from './editar-unidad-routing.module';

import { EditarUnidadPage } from './editar-unidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarUnidadPageRoutingModule
  ],
  declarations: [EditarUnidadPage]
})
export class EditarUnidadPageModule {}
