import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { PopoverModule } from "ngx-bootstrap/popover";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AirlinesComponent } from './components/airlines/airlines.component';
import { CreateAirlineComponent } from './components/airlines/create-airline/create-airline.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CreateScheduleComponent } from './components/schedule/create-schedule/create-schedule.component';
import { StatusModalComponent } from './components/schedule/status-modal/status-modal.component';
import { SearchScheduleComponent } from './components/schedule/search-schedule/search-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AirlinesComponent,
    CreateAirlineComponent,
    ScheduleComponent,
    CreateScheduleComponent,
    StatusModalComponent,
    SearchScheduleComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass :'toast-bottom-right'
    }),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    StatusModalComponent
  ]
})
export class AppModule { }
