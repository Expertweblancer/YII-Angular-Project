export class MapTools{
    public static getSearchRadius(distance:number, extendedDistance):number{
        if (distance>=extendedDistance)
            return 0;
        let a = distance/2;
        let c = extendedDistance/2;
        return Math.sqrt(c*c-a*a);
    }
    public static getSearchMidCoord(from:number, to:number){
        return (from+to)/2;
    }
}