import { Excel } from "../excel/excel.js";

export class MultipleSheets{
    constructor(){
        MultipleSheets.instance = this;
        /**
         * @type {Excel}
         */
        this.excel = Excel.getInstance()
    }

    addSheet(){
        const addSheetBtn = document.querySelector(".addSheetBtn")
        addSheetBtn.addEventListener("click", ()=>{
            this.excel.sheetCounter++;
            const sheetId = `sheet${this.excel.sheetCounter}`;
            
        })
    }

    static getInstance(){
        if(!MultipleSheets.instance){
            MultipleSheets.instance = new MultipleSheets()
        }
        return MultipleSheets.instance
    }
}