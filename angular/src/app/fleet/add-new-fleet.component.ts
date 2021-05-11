import { Component, OnInit, Input } from '@angular/core';
import { FleetTypeModel } from './fleet-type.model';
import { FleetTypeService } from './fleet-type.service';
import { FleetService } from './fleet.service';
import { FleetModel } from './fleet.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { CategoryModel } from '../category/category.model';
import { FleetOrderCategoryService } from './fleet-order-category.service';
import { ProfileService } from '../profile/company/profile.service';
import { FormBuilder, FormGroup, Validators, Validator, NgControl } from '@angular/forms';
import { Helpers } from '../tools/helpers';
import { Location } from '@angular/common';
import { CurrencyModel } from '../common/currency.model';
import { CompanyProfileModel } from '../profile/company/company-profile.model';
import { CurrencyService } from '../common/currency.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'add-new-fleet',
  templateUrl: './add-new-fleet.component.html',
})
export class AddNewFleetComponent implements OnInit {
  fleetTypes: FleetTypeModel[];
  model = new FleetModel();
  working = true;
  saving = false;
  currency: CurrencyModel;
  fleetForm: FormGroup;
  categories: CategoryModel[];
  activeCategories: CategoryModel[];
  showErrorDialog = false;
  messages = Messages;
  max_year: number;


  constructor(private fleetTypeService: FleetTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private fleetService: FleetService,
    private fb: FormBuilder,
    private location: Location,
    private fleetOrderCategoryService: FleetOrderCategoryService,
    private currencyService: CurrencyService,
    private messagesService:MessagesService,
    private profileService: ProfileService) {
    this.fleetForm = this.fb.group({
      name: [null, Validators.required],
      registration: [],
      year: [null, Validators.compose([Validators.max((new Date()).getFullYear()), Validators.min(1960)])],
      id_type: [null, Validators.required],
      width: [],
      height: [],
      loading_width: [null, Validators.compose([Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")])],
      loading_height: [null, Validators.compose([Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")])],
      loading_length: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      max_kg: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      max_km: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      km_rate: [],
      foto: [],
      categories: [],
      id: [],
    });
    this.max_year = (new Date()).getFullYear();
  }

  onSubmit() {
    this.saving = true;
    this.fleetForm.markAsTouched();
    this.model = this.fleetForm.getRawValue();

    if (!this.fleetForm.valid) {
      Helpers.markAsTouched(this.fleetForm);
      this.showErrorDialog = true;
      this.saving = false;
      return;
    }
    this.fleetForm.disable();

    this.fleetService.post(this.model).subscribe(
      data => {
        this.model = data;
        if (this.activeCategories)
          this.fleetOrderCategoryService.set(this.activeCategories, data.id).subscribe(data => {
            this.saving = false;
            this.router.navigate([this.fleetForm.get('id').value ? '../../' : '../', this.model.id], { relativeTo: this.route });
          });
        else {
          this.saving = false;
          this.router.navigate([this.fleetForm.get('id').value ? '../../' : '../', this.model.id], { relativeTo: this.route });
        }
      },
      err => {
        this.saving = false;
      },
      () => this.saving = false
    )
  }

  categoriesToNumberArray(model: CategoryModel[]): number[] {
    let ids: number[] = [];
    this.activeCategories.forEach(val => {
      ids.push(+val.id);
    })
    return ids;
  }

  refreshCategoryValue(data) {
    this.activeCategories = data;
    this.fleetForm.patchValue({ categories: this.categoriesToNumberArray(this.activeCategories) });
  }

  onUploaded(event) {
    this.fleetForm.patchValue({ foto: event[0] });
  }

  cancelClick() {
    this.router.navigate([this.fleetForm.get('id').value ? '../../' : '../'], { relativeTo: this.route });
  }

  ngOnInit() {
    this.working = true;
    let id = 0;
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
    
    this.route.params.subscribe((params: Params) => {
      id = params['id'];
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.profileService.get().subscribe(data => {
        let profile: CompanyProfileModel = data;
        this.currencyService.getCurrency(profile.currency_id).subscribe(data => this.currency = data);
      });
    });

    if (id)
      this.fleetService.get(id).subscribe(
        data => {
          this.model = data;
          //this.fleetForm.
          this.fleetForm.patchValue(this.model);
          console.log(this.fleetForm.getRawValue());

          if (this.model.id) {
            this.fleetOrderCategoryService.getCategories(this.model.id).subscribe(data => {
              console.log('loaded order categories of the fleet');
              console.log(data);

              this.activeCategories = data;
              this.fleetForm.patchValue({ categories: this.categoriesToNumberArray(this.activeCategories) });
              this.fleetForm.markAsTouched();
            });
          }
        });

    // gettomg fleet types
    this.fleetTypeService.getFleetTypes().subscribe(data => {
      this.fleetTypes = data;
      this.working = false;
      console.log(data);
    },
      err => {
        this.working = false;
      }, () => console.log('finished'));
  }
}
class Messages {
  name = "Fleet Name";
  registration_no = "Registration";
  production_year = "Year of production";
  length = "Length [cm]";
  width = "Width [cm]";
  height = "Height [cm]";
  fleet_width = "Fleet Width [cm]";
  fleet_height = "Fleet Height [cm]";
  type = "Type";
  max_km = "Max. distance [km]";
  max_kg = "Max. load [kg]";
  distance_rate = "Distance Rate";
  save = "Save";
  cancel = "Cancel";
  categories = "Categories";
  form_has_erros = "Your Form Contains Errors";
  cant_be_future = "Year of production must not be future or earlier than 1960";
  required = "Required";
  optional = "Optional";
  dimentions_loading_area = "Loading Area Dimensions";
  other_data = "Another Data";
  no_cat_selected="No category selected";
}
