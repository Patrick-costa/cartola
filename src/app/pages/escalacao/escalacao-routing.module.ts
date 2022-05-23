import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscalacaoPage } from './escalacao.page';

const routes: Routes = [
  {
    path: '',
    component: EscalacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscalacaoPageRoutingModule {}
