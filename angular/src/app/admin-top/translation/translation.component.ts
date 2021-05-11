import { Component, OnInit } from '@angular/core';
import { TranslationModel } from './translation.model';
import { TranslationService } from './translation.service';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {
  messages = new Messages();
  translations: TranslationModel[];
  working = false;
  i = 0;
  translationModel = new TranslationModel;
  str: string;
  translation: string;
  toDeleteModel: TranslationModel;
  deleteDialogOn = false;
  selectedLanguage = 'pl'
  constructor(private messageService: MessagesService, private translationService: TranslationService) { }
 
  onSubmit() {
    this.translationModel.language = this.selectedLanguage;
    console.log(JSON.stringify(this.translationModel));
    this.working = true;
    this.translationService.setTranslation(this.translationModel).subscribe(data => {
      this.translationModel = new TranslationModel();
      this.working = false
    
      this.reload();
    })
  }
 
  langChanged(value) {
    this.reload(value);
  }
 
  select(model: TranslationModel) {
    this.translationModel = model;
  }
 
  reload(lang: string = null) {
    if (!lang)
      lang = this.selectedLanguage;
    this.working = true;
    this.translationService.getList(lang).subscribe(data => {
      this.translations = data;
      this.working = false;
    },
      err => this.working = false
    )
  }
  onDeleteConfirm(event: boolean) {
    this.deleteDialogOn = false;
    this.translationModel = new TranslationModel();
    console.log(this.toDeleteModel);
    if (event) {
      this.working = true;
      this.translationService.delete(this.toDeleteModel).subscribe(
        data => {
          this.working = false;
          this.reload()
        }
      )
    }
  }
  deleteConfirm(t: TranslationModel) {
    this.deleteDialogOn = true;
    this.toDeleteModel = t;
  }
  ngOnInit() {
    this.reload();
    this.messageService.translate(this.messages).subscribe(data => this.messages = data);
  }

}
class Messages {

}