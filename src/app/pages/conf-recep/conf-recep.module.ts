import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfRecepPageRoutingModule } from './conf-recep-routing.module';

import { ConfRecepPage } from './conf-recep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfRecepPageRoutingModule
  ],
  declarations: [ConfRecepPage]
})
export class ConfRecepPageModule {}
