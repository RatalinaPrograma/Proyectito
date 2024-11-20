import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarUnidadPageRoutingModule } from './mostrar-unidad-routing.module';

import { MostrarUnidadPage } from './mostrar-unidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarUnidadPageRoutingModule
  ],
  declarations: [MostrarUnidadPage]
})
export class MostrarUnidadPageModule {}
