import { ParcelModel } from '../order/parcel/parcel.model';
import { OrderModel } from '../order/order.model';

export class LandingOrderModel {
    order = new OrderModel();
    parcels: ParcelModel[] = []
    auth = new Auth();
}

export class Auth {
    username: string;
    password: string;
    email: string;
}
