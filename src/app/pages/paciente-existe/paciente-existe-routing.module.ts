import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PacienteExistePage } from './paciente-existe.page';

const routes: Routes = [
  {
    path: '',
    component: PacienteExistePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacienteExistePageRoutingModule {}
