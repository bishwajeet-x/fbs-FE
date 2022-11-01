import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadStart, Router } from '@angular/router';
import { Airline } from 'src/app/interfaces/airline';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styleUrls: ['./airlines.component.scss']
})
export class AirlinesComponent implements OnInit {

  allAirlines: Airline[] = [];

  ngOnInit(): void {
    this.fetchAllAirlines();
  }

  constructor(
    private service: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  fetchAllAirlines = () => {
    this.service.fetchAllAirlines().subscribe(
      data => {
        this.allAirlines = data;
      }
    )
  }

  mealIcon = (id: number) => {
    return (id == 1) ? '/assets/icons/veg.png' : '/assets/icons/non-veg.png';
  }

  triangleClass = (id: number) => {
    return (id == 101) ? {'triangle-green': true} : {'triangle-red': true}
  }

  statusBorderClass = (id: number) => {
    if(id == 101) {
        return {'border': true, 'border-right': true, 'border-success': true}
    } else {
        return {'border': true, 'border-right': true, 'border-danger': true}
    }
  }

  updateStatus = (airline: Airline) => {
    if(confirm("Are you sure you want to change the status?")) {
      const putData = {
        airlineId: airline.airlineId,
        status: airline.airlineStatus.id
      }
      this.service.updateStatus(putData).subscribe(res => {
        this.fetchAllAirlines();
        this.toastr.success(`Status changed successfully!`);
      })
    } else {
      this.toastr.success(`Action cancelled!`)
    }
  }

  deleteAirline = (id: number) => {
    if(confirm("Are you sure you want to delete this airline?")) {
      this.service.deleteAirline(id).subscribe(res => {
        this.fetchAllAirlines();
        this.toastr.success(`Airline deleted successfully!`);
      });
    } else {
      this.toastr.success(`Action cancelled!`)
    }
  }

  editAirline = (airline: Airline) => {
    this.router.navigate([`admin/airlines/edit/${airline.airlineId}`])
  }


}
