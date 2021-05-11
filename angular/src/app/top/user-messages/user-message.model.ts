export class UserMessageModel{
    message:string;
    is_attachment:boolean;
    order_id:number;
    offeree_id:number;
    date_added:string;
    date_seen:string;
    title:string;
    token:string;
    name:string;
    surname:string;
    company_name:string;
    direction:string;
    id:number;
    constructor(order_id:number, token:string){
        this.order_id = order_id;
        this.token = token;
    }
}