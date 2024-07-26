import { GridMain } from "./gridMain.js"
import { GridRow } from "./gridRow.js"

// const container = document.querySelector(".container")
// const gridcol = document.querySelector(".gridCol")
// const main = document.querySelector(".main")
// const gridrow = document.querySelector(".gridRow")
// const gridmain = document.querySelector(".gridMain")


// const numCols = 1000
// const numRows = 1000
// const defCellWidth = 50
// const defCellHeight = 30
// let colWidth = Array(numCols).fill(defCellWidth)
// let rowHeight = Array(numRows).fill(defCellHeight)

// // console.log(gridmain.scrollTop);
// // console.log(rowHeight);

// main.addEventListener("scroll", (e)=>{
//     console.log(gridmain.scrollTop);
// })

// new GridCol("gridCol")
const gMain = new GridMain("gridMain")
new GridRow("gridRow", gMain)