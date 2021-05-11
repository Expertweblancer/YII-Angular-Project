import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FleetService } from './fleet.service';
import { FleetModel } from './fleet.model';
import { FleetTypeModel } from './fleet-type.model';
import { Helpers } from '../tools/helpers';
import { FleetTypeService } from './fleet-type.service';
import { MessagesService } from '../messages/messages.service';
import { FleetFilterModel } from './fleet-filter.model';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { FleetMessages } from './fleet.messages';


@Component({
  selector: 'app-all-fleet',
  templateUrl: './all-fleet.component.html',
  styleUrls: ['./fleet.css']
})
export class AllFleetComponent implements OnInit {
  messages: FleetMessages;
  working = false;
  searching = false;
  fleets: FleetModel[] = [];
  fleetTypes: FleetTypeModel[] = [];
  filter = new FleetFilterModel();
  categories: CategoryModel[];
  fun;

  constructor(private fleetService: FleetService,
    private fleetTypeService: FleetTypeService,
    private router: Router,
    private categoryService: CategoryService,
    private messagesService: MessagesService,
    private route: ActivatedRoute) { }

  addNewClick() {
    this.router.navigate(['../new'], { relativeTo: this.route });
  }

  getFoto(foto: string) {
    return Helpers.getImageLink(foto);
  }

  getFleetType(id: string): string {
    return Helpers.getNameFromModel(id, this.fleetTypes);
  }

  formChange() {
    this.filterFleet();
  }

  filterFleet() {
    this.searching = true;
    if (this.fun)
      this.fun.unsubscribe();
    this.fun = this.fleetService.filter(this.filter).subscribe(data => {
      this.fleets = data;

      for (let i = 0; i < this.fleets.length; i++) {
        this.fleets[i].foto = Helpers.getImageLink(this.fleets[i].foto);
      }
      this.searching = false;
    })
  }


  refreshCategoryValue(data) {
    this.filter.categories = data;
    this.formChange();
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new FleetMessages()).subscribe(data => {
      this.messages = data;
      this.fleetService.get().subscribe(data => {
        this.categoryService.getCategories().subscribe(data => this.categories = data);

        this.fleetTypeService.getFleetTypes().subscribe(types => {
          this.fleetTypes = types;
        });
        this.fleets = data;
        for (let i = 0; i < this.fleets.length; i++) {
          this.fleets[i].foto = Helpers.getImageLink(this.fleets[i].foto);
        }
        this.working = false;
      },
        err => {
          this.working = false;
        });
    })
  }
}
