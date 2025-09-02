import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarAuthComponent } from './navbar-auth/navbar-auth.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NavbarAuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavbarComponent, FooterComponent, NavbarAuthComponent, RouterModule]
})
export class SharedModule { }
