export class SingleCheckBoxModel{
    value:string;
    text:string;
    checked:boolean;
    constructor(v, t, c=false){
        this.value = v;
        this.text = t;
        this.checked = c;
    }
}