import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalheJogadorPageRoutingModule } from './detalhe-jogador-routing.module';

import { DetalheJogadorPage } from './detalhe-jogador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalheJogadorPageRoutingModule
  ],
  declarations: [DetalheJogadorPage]
})
export class DetalheJogadorPageModule {}
