import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerRoutingModule } from './organizer-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    OrganizerRoutingModule,
    SharedModule
  ]
})
export class OrganizerModule { }