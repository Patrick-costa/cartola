import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'escalacao',
    loadChildren: () => import('./pages/escalacao/escalacao.module').then( m => m.EscalacaoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'parciais',
    loadChildren: () => import('./pages/parciais/parciais.module').then( m => m.ParciaisPageModule)
  },
  {
    path: 'detalhe-jogador/:id',
    loadChildren: () => import('./pages/detalhe-jogador/detalhe-jogador.module').then( m => m.DetalheJogadorPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
