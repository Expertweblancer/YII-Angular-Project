import { AddressModel } from '../google-maps/address.model';
import { FleetModel } from '../fleet/fleet.model';
export class OrderListFilterModel{
    filterFromAddressModel:AddressModel;
    filterToAddressModel:AddressModel;
    date_execution:string;
    category_id:number;
    categories:string[];
    name:string;
    range_date:string;


    status:string;
    sort:string;
    index:number;
    
    start_lat:string;
    start_lng:string;
    end_lat:string;   
    end_lng:string;    
    radius:string;
    distance:number;
    
    from_country_id:number;
    to_country_id:number;

    constructor(status = 'open'){
        this.status = status;
        this.sort = 'desc';
    }
}