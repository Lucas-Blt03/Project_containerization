import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: EventListComponent
  },
  {
    path: 'create',
    component: EventCreateComponent,
    canActivate: [RoleGuard],
    data: { roles: ['organizer', 'moderator'] }
  },
  {
    path: ':id',
    component: EventDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }