export class UserInfoModel {
    uid:number;
    company_profile_id:number;
    auth_key:string;
    is_admin:boolean = false;
    is_trustee:boolean = false;
    has_company_profile:boolean = false;
    has_customer_profile:boolean;
    no_profile_but_orders:boolean;
    username:string;
    name:string;
    surname:string;
    foto:string;
    company_logo;
    status:boolean;
    response:string;
}