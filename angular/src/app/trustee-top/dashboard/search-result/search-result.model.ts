export class SearchResultModel{
    orders:     Orders[];
    users:      Users[];
    companies:  Companies[];
}

class Orders{
    title:string;
    id:string;
}
class Users{
    name:string;
    surname:string;
    email:string;
    username:string;
    id:string;
}
class Companies{
    name:string;
    id:string;
}