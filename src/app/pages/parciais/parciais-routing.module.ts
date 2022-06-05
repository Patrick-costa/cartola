import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParciaisPage } from './parciais.page';

const routes: Routes = [
  {
    path: '',
    component: ParciaisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParciaisPageRoutingModule {}
