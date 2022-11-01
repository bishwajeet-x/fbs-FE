import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirlinesComponent } from './components/airlines/airlines.component';
import { CreateAirlineComponent } from './components/airlines/create-airline/create-airline.component';
import { LoginComponent } from './components/login/login.component';
import { CreateScheduleComponent } from './components/schedule/create-schedule/create-schedule.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SearchScheduleComponent } from './components/schedule/search-schedule/search-schedule.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin' , children: [
    { path: 'airlines', children: [
      { path: '', component: AirlinesComponent },
      { path: 'create', component: CreateAirlineComponent },
      { path: 'edit/:id', component: CreateAirlineComponent }
    ] },
    {path: 'schedule', children: [
      { path: '', component: ScheduleComponent},
      { path: 'create', component: CreateScheduleComponent},
      { path: 'edit/:fCode', component: CreateScheduleComponent },
      { path: 'search', component: SearchScheduleComponent }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
