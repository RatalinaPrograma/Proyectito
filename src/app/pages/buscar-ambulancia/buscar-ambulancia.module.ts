import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarAmbulanciaPageRoutingModule } from './buscar-ambulancia-routing.module';

import { BuscarAmbulanciaPage } from './buscar-ambulancia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarAmbulanciaPageRoutingModule
  ],
  declarations: [BuscarAmbulanciaPage]
})
export class BuscarAmbulanciaPageModule {}
