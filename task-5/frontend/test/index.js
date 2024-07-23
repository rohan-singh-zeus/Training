import { Graph } from "./graph.js";
import { Grid } from "./grid.js";
import { RowGrid } from "./rowCanvas.js";

// Global Variables
const defaultCellWidth = 100;
const cellHeight = 30;
const numRows = 100;
const numCols = 1000;
let columnWidths = Array(numCols).fill(defaultCellWidth);
let selectedCells = [];
let cellsData = []
let cellsCol = []
let isDragging = false;
let isResizing = false;
let resizeColIndex = -1;
let startX = 0;
let startCell = null;
let currentCell = null;

// Initialize the grid
const grid = new Grid("gridCanvas", columnWidths, selectedCells, isDragging, isResizing, resizeColIndex, startX, startCell, currentCell, numRows, numCols, cellsData, cellsCol);

new RowGrid("gridCanvas2", columnWidths, selectedCells, isDragging, isResizing, resizeColIndex, startX, startCell, currentCell, numRows, numCols, grid)

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
  grid.filterRows(findValue);
  grid.drawGrid();
}

const file = document.querySelector(".file");
const opeartions = document.querySelector(".operations");
const oGraph = document.querySelector(".oGraph");
const ctx = document.getElementById("myChart");
const graph = document.querySelector(".graph");
const barGraph = document.querySelector(".bar")
const lineGraph = document.querySelector(".line")
const pieGraph = document.querySelector(".pie")
const r31 = document.querySelector(".r-31");
const r32 = document.querySelector(".r-32");
const r33 = document.querySelector(".r-33");

file.addEventListener("click", () => {
  r31.style.display = "inline-flex";
  r32.style.display = "none";
  r33.style.display = "none";
});

opeartions.addEventListener("click", () => {
  r31.style.display = "none";
  r32.style.display = "inline-flex";
  r33.style.display = "none";
});

oGraph.addEventListener("click", () => {
  r31.style.display = "none";
  r32.style.display = "none";
  r33.style.display = "inline-flex";
});

barGraph.addEventListener("click", ()=>{
  graph.style.display = "inline-block"
  grid.constructBar()
})

lineGraph.addEventListener("click", ()=>{
  graph.style.display = "inline-block"
  grid.constructLine()
})

pieGraph.addEventListener("click", ()=>{
  graph.style.display = "inline-block"
  grid.constructPie()
})

// new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
