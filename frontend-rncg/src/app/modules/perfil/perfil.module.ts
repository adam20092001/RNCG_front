import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PerfilComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class PerfilModule { }
