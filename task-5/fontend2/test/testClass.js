import { Grid } from "./grid.js";

export class Test extends Grid{
    constructor(){
        this.init()
    }

    init(){
        console.log(this.posX);
    }
}