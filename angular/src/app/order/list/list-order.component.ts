import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderModel } from '../order.model';
import { ListOrderMessages } from './list-order.messages';
import { MessagesService } from '../../messages/messages.service';
import { CategoryModel } from '../../category/category.model';
import { AgoDateFormatMessagesModel } from '../../ago-date-format/ago-date-format-messages.model';
import { FleetService } from '../../fleet/fleet.service';
import { FleetModel } from '../../fleet/fleet.model';
import { SystemMode } from '../../top/system-mode';
import { Helpers } from '../../tools/helpers';
import { CurrencyService } from '../../common/currency.service';
import { CurrencyModel } from '../../common/currency.model';

@Component({
  selector: 'list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  _orders: OrderModel[];
  @Input()
  set orders(val: OrderModel[]) {
    this._orders = val;
    if (this.sortAsc)
      this._orders = this._orders.reverse();
  }

  @Input() messages: ListOrderMessages;
  @Input() categories: CategoryModel[];
  @Input() currencies: CurrencyModel[];
  @Input() agoComponentMessages: AgoDateFormatMessagesModel;
  @Output() onOrderClick = new EventEmitter<number>();
  @Input() filter: string;
  fleets: FleetModel;
  systemMode = new SystemMode();
  sortAsc = false;

  constructor(private messagesService: MessagesService, private currencyService: CurrencyService, private fleetService: FleetService) { }

  sort(asc: boolean) {
    if (asc == this.sortAsc)
      return;
    this.sortAsc = !this.sortAsc;
    this._orders = this._orders.reverse();
  }

  getCurrency(id: number) {
    for (let i = 0; i < this.currencies.length; i++)
      if (+this.currencies[i].id == +id)
        return this.currencies[i].name;
  }

  getIcon(id: number) {
    return Helpers.getCategoryIcon(id);
  }

  getCategory(id: number): string {
    let cat = 'no cat ' + id;

    this.categories.forEach((val, i) => {
      if (val.id == id.toString()) {
        cat = val.text;
      }
    });
    return cat;
  }

  selectOrder(id: number) {
    console.log(id);
    this.onOrderClick.emit(id);
  }

  ngOnInit() {
    console.log('filter in list of orders:' + this.filter);

    if (!this.currencies) {
      this.currencyService.getList().subscribe(data => this.currencies = data)
    }

    if (!this.messages)
      this.messagesService.translate(new ListOrderMessages()).subscribe(data => this.messages = data);
    if (this.systemMode.is_company)
      this.fleetService.get().subscribe(data => this.fleets = data);
  }

}
