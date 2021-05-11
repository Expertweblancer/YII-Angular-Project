import { Component, OnInit, Input } from '@angular/core';



@Component({
    selector: 'order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

    @Input() headers: string[];
    @Input() orders: { columns: [{ category: number, value: string, isPrice: boolean, km: number }], isActive?: boolean }[];
    @Input() withNumber: boolean;

    ngOnInit() {}

}