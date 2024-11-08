import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaMedicoPage } from './vista-medico.page';

const routes: Routes = [
  {
    path: '',
    component: VistaMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaMedicoPageRoutingModule {}
