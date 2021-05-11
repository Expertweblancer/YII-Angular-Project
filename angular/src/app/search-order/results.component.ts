import { Component, OnInit, Input } from '@angular/core';  
import { OrderModel } from '../order/order.model';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'search-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() searchResults:OrderModel[];
  
  categoryModels:CategoryModel[];
  constructor(private categoryService:CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data=>this.categoryModels = data, error=>console.log('cant get categories '))
  }

  getCategoryName(id){
    if (id===undefined || this.categoryModels===undefined)return;
    //iterate over each element in the array
    for (var i = 0; i < this.categoryModels.length; i++)
      if (id === this.categoryModels[i].id.toString())
        return  this.categoryModels[i].text;
    
    return 'name not found error:';// + id;
  }
}
