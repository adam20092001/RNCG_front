import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'analysis',
    loadChildren: () => import('./modules/analysis/analysis.module').then(m => m.AnalysisModule)
  },
  { path: 'resultados', loadChildren: () => import('./modules/results/results.module').then(m => m.ResultsModule) },
  { path: 'pacientes', loadChildren: () => import('./modules/pacientes/pacientes.module').then(m => m.PacientesModule) },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule) },
  { path: 'perfil', loadChildren: () => import('./modules/perfil/perfil.module').then(m => m.PerfilModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
