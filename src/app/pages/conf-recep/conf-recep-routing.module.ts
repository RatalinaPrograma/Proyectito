import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfRecepPage } from './conf-recep.page';

const routes: Routes = [
  {
    path: '',
    component: ConfRecepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfRecepPageRoutingModule {}
