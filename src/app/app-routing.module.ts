import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, // redirección inicial
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
  { path: 'perfil', loadChildren: () => import('./modules/perfil/perfil.module').then(m => m.PerfilModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
