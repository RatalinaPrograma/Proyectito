import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarAmbulanciaPage } from './buscar-ambulancia.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarAmbulanciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarAmbulanciaPageRoutingModule {}
