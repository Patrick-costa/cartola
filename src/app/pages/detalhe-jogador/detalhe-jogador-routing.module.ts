import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalheJogadorPage } from './detalhe-jogador.page';

const routes: Routes = [
  {
    path: '',
    component: DetalheJogadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalheJogadorPageRoutingModule {}
