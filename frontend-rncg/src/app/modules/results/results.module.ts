import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ResultsModule { }
