import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscalacaoPageRoutingModule } from './escalacao-routing.module';

import { EscalacaoPage } from './escalacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscalacaoPageRoutingModule
  ],
  declarations: [EscalacaoPage]
})
export class EscalacaoPageModule {}
