import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MealType } from 'src/app/interfaces/meal-type';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Airline } from 'src/app/interfaces/airline';

@Component({
  selector: 'app-create-airline',
  templateUrl: './create-airline.component.html',
  styleUrls: ['./create-airline.component.scss']
})
export class CreateAirlineComponent implements OnInit {

  mealAvailable: boolean = false;
  mealType: MealType[] = [];
  mealTypeSelected: number[] = [];
  public airlineForm!: FormGroup;

  action: string = 'add';
  _airlineId!: number;

  constructor(
    private formFB: FormBuilder,
    private service: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createAirlineForm();
    this.activatedRoute.params.subscribe(data => {
      if(this.handleAction(data) === 'edit') {
        this.fetchAirlineById(data['id']);
      }
    });
  }

  handleAction = (data: any) => {
    this._airlineId = data['id'];
    this.action = this._airlineId ? 'edit' : 'add';
    return this.action;
  }

  private fetchAirlineById = (id: number) => {
    this.service.fetchAirlineById(id).subscribe(data => {
      console.log(data)
      this.setDataToForm(data);
    }, err => {
      this.toastr.error(`Oops something went wrong!`);
    })
  }

  private createAirlineForm = () => {
    this.airlineForm = this.formFB.group({
      airlineId: [null],
      airlineName: ['', Validators.compose([Validators.required])],
      noOfSeats: ['', Validators.compose([Validators.required])],
      mealAvailable: [false, Validators.compose([Validators.required])],
      mealType: ['', Validators.compose([Validators.required])],
      status: [101]
    });
  }

  private setDataToForm = (data: Airline) => {
    this.airlineForm.controls['airlineName'].setValue(data.airlineName);
    this.airlineForm.controls['noOfSeats'].setValue(data.noOfSeats);
    this.airlineForm.controls['status'].setValue(data.airlineStatus.id)
    this.mealAvailable = data.mealAvailable;
    let maid;
    if(this.mealAvailable) {
      maid = '#mealAvailableTrue';
      this.mealTypeSelected = data.mealType.map(item => item.typeId);
      this.fetchAllMealTypes();
    } else {
      maid = '#mealAvailableFalse';
    }
    const radio = document.querySelector(maid) as HTMLInputElement;
    radio.checked = true;
  }

  commitCheck = (id: number) => {
    return this.mealTypeSelected.includes(id) ? true : false;
  }

  persistAirline = () => {
    this.action === 'add' ? this.addAirline() :  this.editAirline();
  }

  addAirline = () => {
    this.airlineForm.controls['mealAvailable'].setValue(this.mealAvailable);
    this.airlineForm.controls['mealType'].setValue(this.mealTypeSelected);
    this.service.addAirline(this.airlineForm.value).subscribe(
      res => {
        this.toastr.success(`Airline added successfully!`);
        this.router.navigate(['/admin/airlines']);
      }, err => {
        this.toastr.error(`Oops something went wrong!`);
      }
    )
  }

  editAirline = () => {
    this.airlineForm.controls['airlineId'].setValue(this._airlineId);
    this.airlineForm.controls['mealAvailable'].setValue(this.mealAvailable);
    this.airlineForm.controls['mealType'].setValue(this.mealTypeSelected);
    this.service.editAirline(this.airlineForm.value).subscribe(
      res => {
        this.toastr.success(`Airline edited successfully!`);
        this.router.navigate(['/admin/airlines']);
      }, err => {
        this.toastr.error(`Oops something went wrong!`);
      }
    )
  }

  selectMeal(data: boolean) {
    this.mealAvailable = data;
    if(this.mealAvailable) {
      this.fetchAllMealTypes();
    }
  }

  fetchAllMealTypes = () => {
    this.service.fetchAllMealTypes().subscribe(data => {
      this.mealType = data;
    }, err => {
      this.toastr.error(`Oops something went wrong!`);
    })
  }

  selectMealType(data: number) {
    const isPresent = this.mealTypeSelected.findIndex((item => item == data));
    if(isPresent >= 0) {
      this.mealTypeSelected.splice(isPresent, 1);
    } else {
      this.mealTypeSelected.push(data);
    }
  }

}
