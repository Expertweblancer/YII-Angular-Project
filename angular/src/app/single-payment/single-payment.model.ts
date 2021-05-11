export class SinglePaymentModel{
    success:boolean;
    confirmed:boolean;
    id:number;
    order_id:number;
    created:string;
    amount:number;
    paid_amount:number;
    session_id:string;
    return_url:string;
    p24_oid:string;
}