import { Grid } from "./grid.js";
import { RowGrid } from "./rowCanvas.js";


// Global Variables
const defaultCellWidth = 100;
const cellHeight = 30;
const numRows = 100;
const numCols = 1000;
let columnWidths = Array(numCols).fill(defaultCellWidth);
let selectedCells = [];
let isDragging = false;
let isResizing = false;
let resizeColIndex = -1;
let startX = 0;
let startCell = null;
let currentCell = null;
 
// Initialize the grid
const grid = new Grid("gridCanvas", columnWidths, selectedCells, isDragging, isResizing, resizeColIndex, startX, startCell, currentCell, numRows, numCols);

new RowGrid("gridCanvas2", columnWidths, selectedCells, isDragging, isResizing, resizeColIndex, startX, startCell, currentCell, numRows, numCols, grid)

// handleMouseDown(event) {
//   const { offsetX, offsetY } = event;
//   let col = 0;
//   let x = 0;
//   let y = 0;

//   for (let i = 0; i < this.numCols; i++) {
//     x += this.columnWidths[i];
//     if (offsetX < x) {
//       col = i;
//       break;
//     }
//   }
//   const row = Math.floor(offsetY / cellHeight);
//   if (offsetX > x - 10 && offsetX < x + 10) {
//     isResizing = true;
//     resizeColIndex = col;
//     startX = offsetX;
//     this.canvas.style.cursor = "col-resize";
//   } else {
//     isDragging = true;
//     startCell = [row, col];
//     currentCell = [row, col];
//     updateSelectedCells(startCell, currentCell);
//     drawGrid();
//   }
// }

// handleMouseMove(event) {
//   const { offsetX, offsetY } = event;

//   if (this.isResizing) {
//     const delta = offsetX - startX;
//     columnWidths[resizeColIndex] += delta;
//     startX = offsetX;
//     drawGrid();
//   } else if (isDragging) {
//     let col = 0;
//     let x = 0;
//     for (let i = 0; i < numCols; i++) {
//       x += columnWidths[i];
//       if (offsetX < x) {
//         col = i;
//         break;
//       }
//     }
//     const row = Math.floor(offsetY / cellHeight);
//     currentCell = [row, col];
//     updateSelectedCells(startCell, currentCell);
//     drawGrid();
//   } else {
//     let x = 0;
//     for (let i = 0; i < numCols; i++) {
//       x += columnWidths[i];
//       if (offsetX > x - 5 && offsetX < x + 5) {
//         canvas.style.cursor = "col-resize";
//         return;
//       }
//     }
//     canvas.style.cursor = "default";
//   }
// }

// handleMouseUp(event) {
//   const { offsetX, offsetY } = event;
//   let col = 0;
//   let x = 0;

//   for (let i = 0; i < numCols; i++) {
//     x += columnWidths[i];
//     if (offsetX < x) {
//       col = i;
//       break;
//     }
//   }

//   const row = Math.floor(offsetY / cellHeight);
//   count = 0;
//   sum = 0;
//   avg = 0;
//   min = 6555550;
//   max = -6555550;
//   if (this.isDragging) {
//     isDragging = false;
//     startCell = null;
//     currentCell = null;
//   }
//   if (isResizing) {
//     isResizing = false;
//     canvas.style.cursor = "default";
//   }
//   if (selectedCells.length > 0) {
//     for (let i = 0; i < selectedCells.length; i++) {
//       if (typeof selectedCells[i][2] === "number") {
//         sum += selectedCells[i][2];
//         count += 1;
//         min = Math.min(min, selectedCells[i][2]);
//         max = Math.max(max, selectedCells[i][2]);
//       } else {
//         continue;
//       }
//     }
//     const sumText = document.querySelector(".sum");
//     sumText.innerHTML = `Sum: <span>${this.sum}</span>`;
//     const minText = document.querySelector(".min");
//     minText.innerHTML = `Min: <span>${this.min}</span>`;
//     const maxText = document.querySelector(".max");
//     maxText.innerHTML = `Max: <span>${this.max}</span>`;
//     const avgText = document.querySelector(".avg");
//     avgText.innerHTML = `Average: <span>${this.sum / this.count}</span>`;
//   }
//   if (row === 0) {
//     updateSelectedCol(col);
//     this.drawGrid();
//   }
//   if (col === 0) {
//     updateSelectedRow(row);
//     drawGrid();
//   }
// }
 
const findReplace = document.querySelector(".findReplace");
findReplace.addEventListener("click", handleFindReplace);
 
const find = document.querySelector(".find");
find.addEventListener("click", handleFind);
 
function handleFindReplace() {
  const findValue = prompt("Enter the value to find:");
  if (findValue === null) return; // Cancelled
 
  const replaceValue = prompt("Enter the value to replace it with:");
  if (replaceValue === null) return; // Cancelled
 
  // Iterate through gridData and replace values
  for (let row = 0; row < grid.numRows; row++) {
    for (let col = 0; col < grid.numCols; col++) {
      if (grid.gridData[row][col] === findValue) {
        grid.gridData[row][col] = replaceValue;
      }
    }
  }
 
  // Re-render the grid
  grid.drawGrid();
}
 
function handleFind() {
  const findValue = prompt("Enter the value to find:");
  if (findValue === null) return; // Cancelled
  grid.filteredRows(findValue);
  grid.drawGrid();
}
 
const file = document.querySelector(".file");
const opeartions = document.querySelector(".operations");
const r31 = document.querySelector(".r-31");
const r32 = document.querySelector(".r-32");
 
file.addEventListener("click", () => {
r31.style.display = "inline-flex";
r32.style.display = "none";
});
 
opeartions.addEventListener("click", () => {
r31.style.display = "none";
r32.style.display = "inline-flex";
});