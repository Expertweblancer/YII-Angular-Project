import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { CategoryModel } from '../../../category/category.model';
import { SingleCheckBoxModel } from '../../../common/checkbox.model';

@Component({
  selector: 'filter-categories',
  templateUrl: './filter-categories.component.html',
  styleUrls: ['./filter-categories.component.css']
})
export class FilterCategoriesComponent implements OnInit {
  messages:Messages;
  checkBoxes:SingleCheckBoxModel[]=[];
  retCategories:string[];
  working=false;
  constructor(private messagesService:MessagesService) { }
  @Input() categories:CategoryModel[];
  @Output() onFilterCategoriesChange = new EventEmitter<string[]>();

  markAll(){
    this.checkBoxes.forEach(element => {
      element.checked=true;
    });
    let categories:string[] = this.checkBoxes.filter(opt => opt.checked).map(opt => opt.value);    
    this.onFilterCategoriesChange.emit(categories);
  }  
  
  onModelChange(v:boolean, el:SingleCheckBoxModel){
    
    this.checkBoxes.forEach((e) => {
      if (el.value == e.value){
        e.checked = v;
      } 
    });

    let categories:string[] = this.checkBoxes.filter(opt => opt.checked).map(opt => opt.value);
    this.onFilterCategoriesChange.emit(categories);
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      if (this.categories){
        for (let i=0;i<this.categories.length; i++)
          this.checkBoxes.push(new SingleCheckBoxModel(this.categories[i].id, this.categories[i].text, true));
      } else
        console.log('FilterCategories - no categories!!!');
      this.working = false;
    })
  }
}
class Messages{
  mark_all = "Mark All";
  categories = "Categories";
  choose = "Choose";
}