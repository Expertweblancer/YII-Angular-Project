import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { ManualInvoiceModel } from './manual-invoice.model';
// import { OrderModel } from '../../order/order.model';
// import { OrderService } from '../../order/order.service';
import { ManualInvoiceService } from './manual-invoice.service';
import { Helpers } from '../../tools/helpers';
// import { TruncatePipe } from '../../shared/truncate.pipe';
import { SystemMode } from '../../top/system-mode';
@Component({
  selector: 'app-company-manual-invoices',
  templateUrl: './company-manual-invoices.component.html',
  styleUrls: ['./company-manual-invoices.component.scss']
})
export class CompanyManualInvoicesComponent implements OnInit {
  messages   : Messages;
  orders     : ManualInvoiceModel[] = [];
  working    = false;
  showDelete = false;
  invoiceToDelete:ManualInvoiceModel;
  systemMode = new SystemMode();
  
  constructor(private messagesService:MessagesService, private invoiceService:ManualInvoiceService) { }
  
  getDownloadUrl(file){
    return Helpers.getBackendUrl()+'upload/'+file
  }

  deleteInvoiceConfirmation(result:boolean){
    if (result==true) {
      console.log(this.invoiceToDelete);
      
      this.invoiceService.delete(this.invoiceToDelete).subscribe(data=>{
        let i:number = this.orders.indexOf(this.invoiceToDelete);
        this.orders[i].filename = undefined;
        this.orders[i].created = undefined;
        this.orders[i].num = undefined;
        this.orders[i].comment = undefined;
        this.showDelete = false;
      });
    } else
      this.showDelete = false;  
  }

  deleteInvoiceClick(i:number){
    this.invoiceToDelete = this.orders[i];
    this.showDelete = true;
  }


  onUploaded(fileArray){

    let index = this.getIndexFromArrayByOrderId(fileArray.index);

    console.log(fileArray.index +' === '+ index);
    
    let inv: ManualInvoiceModel = this.orders[index];
    inv.filename = fileArray.files[0];
    this.invoiceService.set(inv).subscribe((data)=>{
      this.orders[index].created = data.created;
      this.orders[index].id = data.id;
    });
  }
  
  getFileIcon(name:string):string{
    return Helpers.getFileIconCssByFileName(name);
  }
  
  getIndexFromArrayByOrderId(oid:number){
    let retVal = -1;
    this.orders.forEach((val, i)=>{
      if (val.order_id.toString() == oid.toString())
        retVal = i;
    })
    return retVal;
  }

  ngOnInit() {
    this.working    = true;
    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.invoiceService.getCompleated(this.systemMode.is_company).subscribe(data=>{
        this.orders = data;     
        this.working  = false;
        console.log(data);
      });
    });
  }
}

class Messages{
  date = "Date";
  no_invoices_yet = "There are no any invoices yet";
  add = "Add";
  order_title = "Order";
  route = "Route";
  execution_date = "Execution Date";
  invoice_number = "Invoice Number";
  comment = "Comment";
  upload_invoice = "Upload Invoice";
  invoice_added = "Added"
  number = "Number";
  n_a = "N/A"
  file = "File";
}