import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeRoutingModule } from '../modules/home/home-routing.module';
import { NavbarAuthComponent } from './navbar-auth/navbar-auth.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NavbarAuthComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [NavbarComponent, FooterComponent, NavbarAuthComponent]
})
export class SharedModule { }
