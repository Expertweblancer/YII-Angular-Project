import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent implements OnInit {
  @Output() onUploaded=new EventEmitter<any>();
  @Output() onUploadedWithIndex=new EventEmitter<any>();
  @Input() accept:string;
  @Input() css_class:string = "btn btn-secondary";
  @Input() index:string;
  @Input() caption:string = "Select File";
  @Input() showAttachIcon = false;

  @ViewChild('fileInput') fileInput:any;
  files:string[]=[];
  constructor(private fus:FileUploadService) {
    if (!this.index)
      this.index = ""
  }
  
  fileInputChange(event){
    let file = event.srcElement.files;
    let postData = {field1:"field1", field2:"field2"}; 
    this.fus.upload(postData,file).subscribe(data=>{
      if (data.status){
        if (this.index!='')
          this.onUploadedWithIndex.emit({index:this.index, files:data.fileNames});        
        else
          this.onUploaded.emit(data.fileNames);        
      }
      this.fileInput.nativeElement.value = "";
    },
    err=>console.log(err))
  }
  click(){
    let id ='file-input-snarto-' + this.index;
    document.getElementById(id).click();
  }
  ngOnInit() {
    console.log(this.index);
    
    if (!this.accept)
      this.accept = "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*";
    console.log(this.accept);  
  }

}
