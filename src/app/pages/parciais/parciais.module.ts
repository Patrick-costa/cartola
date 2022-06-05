import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParciaisPageRoutingModule } from './parciais-routing.module';

import { ParciaisPage } from './parciais.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParciaisPageRoutingModule
  ],
  declarations: [ParciaisPage]
})
export class ParciaisPageModule {}
