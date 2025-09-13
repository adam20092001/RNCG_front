import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { SharedModule } from '../../shared/shared.module'; // si tienes shared con navbar/footer
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

const routes: Routes = [
  { path: '', component: ResetPasswordComponent }
];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule {}
