import { OrderAttachmentsModel } from './other/order-attachments.model';
import { OrderTimeModel } from './other/order-time.model';
import { OrderOfferModel } from './offer/order-offer.model';
import { ParcelModel } from './parcel/parcel.model';
export class OrderModel{
    isNewModel = true;
    id:number;
    user_id:number;
    title:string;
    info:string;
    foto:string;
    category_id:number;
    from_city:string;
    from_address:string;
    from_country_short:string;    
    from_info:string;
    from_lat:string;
    from_long:string;
    date_from:string;
    date_to:string;
    to_city:string;
    to_address:string;
    to_country_short:string;
    to_lat:string;
    to_long:string;
    to_info:string;
    date_added:string;
    date_modified:string;
    date_paid:string;
    date_completed:string;
    is_selected:boolean;
    is_active:boolean;
    is_deleted:boolean;
    is_paid:boolean;
    distance:number = 0;
    payment_type_id:number;
    currency_id:number;
    parcels:ParcelModel[] = [];
    attachments:OrderAttachmentsModel[]=[];
    time:OrderTimeModel = new OrderTimeModel();
    offers:OrderOfferModel[];
    canEdit = false;
    required_capacity: number;
    max_width:number;
    max_height:number;
    max_depth:number;
    total_weight:number;
    status:string;
    trustee_id:number;

    best_price:number;
    num_offers:number;
    token:string;
}