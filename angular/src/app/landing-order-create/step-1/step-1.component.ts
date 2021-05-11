import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CategoryService } from '../../category/category.service';
import { CategoryModel } from '../../category/category.model';
import { Helpers } from '../../tools/helpers';
import { LandingMessages } from '../landing-messages';

@Component({
  selector: 'step-1',
  templateUrl: './step-1.component.html',
  styleUrls: ['./step-1.component.css'],
})
export class Step1Component implements OnInit {
  @Output() onSelect = new EventEmitter<number>();
  @Input() messages:LandingMessages;
  @Input() selectedCategory:number;
  boxClass = "squere d-flex flex-column justify-content-center align-items-center";

  categoriesTop: CategoryModel[] = [];
  categoriesBottom: CategoryModel[] = [];

  constructor(private categoryService: CategoryService) { }
  getIcon(id: number) {
    return Helpers.getCategoryIcon(id);
  }

  categoryClick(id:number){
    this.selectedCategory = id;
  }
  
  next(){
    if (this.selectedCategory)
      this.onSelect.emit(+this.selectedCategory);
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (i<5)
          this.categoriesTop.push(data[i]);
        else
          this.categoriesBottom.push(data[i]);
      }
    });
  }

}
