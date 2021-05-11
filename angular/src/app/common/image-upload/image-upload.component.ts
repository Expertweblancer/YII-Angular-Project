import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { Helpers } from '../../tools/helpers';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Output() onUploaded    = new EventEmitter<any>();
  @Output() onStartUpload = new EventEmitter<boolean>();
  @Input()  accept = "image/*";
  @Input()  css_class:string = "btn btn-secondary";
  @Input()  caption:string = "Select File";
  
  uploading = false;
  uploaded=false;
  files:string[]=[];
  constructor(private fus:FileUploadService) { }
  
  fileInputChange(event){
    this.uploaded = false;
    this.uploading = true;
    this.onStartUpload.emit(true);
    let file = event.srcElement.files;
    let postData = {field1:"field1", field2:"field2"}; // Put your form data variable. This is only example.
    this.fus.upload(postData,file).subscribe(data=>{
      this.uploading = false;
      console.log(data);
      if (data.status){
        this.uploaded = true;
        this.files =data.fileNames;
        console.log(this.files);
        this.onUploaded.emit(data.fileNames);
      }
    },
    err=>{
      this.onUploaded.emit(null);
      console.log(err)
    })
  }
  getImageLink(f):string{
    return Helpers.getImageLink(f);
   }
  ngOnInit() {
  
  }

}
