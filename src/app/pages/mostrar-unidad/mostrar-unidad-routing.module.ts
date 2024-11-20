import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarUnidadPage } from './mostrar-unidad.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarUnidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarUnidadPageRoutingModule {}
