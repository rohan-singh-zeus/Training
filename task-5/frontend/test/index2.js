const defaultCellWidth = 100;
const cellHeight = 30;
const numRows = 100;
const numCols = 1000;
let columnWidths = Array(numCols).fill(defaultCellWidth);
let gridData = Array.from({ length: numRows }, () => Array(numCols).fill(""));
let gridCols = [];
let gridRows = [];

let selectedCells = [];
let isDragging = false;
let isResizing = false;
let resizeColIndex = -1;
let startX = 0;
let startCell = null;
let currentCell = null;

let sum = 0;
let min = 0;
let max = 0;
let avg = 0;
let count = 0;

class Cell {
  // cell properties
  x;
  y;
  val;
  ctx;

  constructor(x, y, val, ctx) {
    this.x = x;
    this.y = y;
    this.val = val;
    this.ctx = ctx;
  }

  drawFirstCol() {
    for (let row = 0; row < numRows; row++) {
        // let x = columnWidths[0];
        for (let col = 0; col < 1; col++) {
          const width = columnWidths[col];
          this.y = row * cellHeight;
          this.ctx.fillStyle = "#F5F5F5";
          this.ctx.fillRect(0, this.y, width, cellHeight);
          this.ctx.strokeStyle = "#b6b6b6";
          this.ctx.strokeRect(0, this.y, width, cellHeight);
          this.ctx.fillStyle = "#000000";
          this.ctx.font = "11px Arial";
          // ctx.textAlign = 'center'
          // ctx.textBaseline = 'middle'
          if (gridRows[row]) {
            this.ctx.fillText(gridRows[row], 50, this.y + 20);
          } else {
            this.ctx.fillText("", 50, this.y + 20);
          }
          // x += width;
        }
      }
  }

  drawFirstRow() {
    for (let row = 0; row < 1; row++) {
      this.x = columnWidths[0];
      for (let col = 0; col < numCols; col++) {
        const width = columnWidths[col + 1];
        // const y = row * cellHeight;
        this.ctx.fillStyle = "#F5F5F5";
        this.ctx.fillRect(this.x, 0, width, cellHeight);
        this.ctx.strokeStyle = "#b6b6b6";
        this.ctx.strokeRect(this.x, 0, width, cellHeight);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "11px Arial";
        this.ctx.fontWeight = "bold";
        if (gridCols[col]) {
          this.ctx.fillText(gridCols[col], this.x + 5, 20);
        } else {
          this.ctx.fillText("", this.x + 5, 20);
        }
        this.x += width;
      }
    }
  }

  drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  this.drawFirstCol();
  this.drawFirstRow();

  for (let row = 0; row < numRows; row++) {
    // let x = columnWidths[1];
    let x = columnWidths[0];
    for (let col = 0; col < numCols; col++) {
      const width = columnWidths[col + 1];
      // if(row == 0)
      const y = (row + 1) * cellHeight;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, width, cellHeight);
      ctx.strokeStyle = "#dfdfde";
      ctx.strokeRect(x, y, width, cellHeight);
      ctx.fillStyle = "#000000";
      ctx.font = "11px Arial";
      if (gridData[row][col]) {
        ctx.fillText(gridData[row][col], x + 5, y + 20);
      } else {
        ctx.fillText("", x + 5, y + 20);
      }
      x += width;
    }
  }

  selectedCells.forEach(([row, col, data]) => {
    let x = columnWidths.slice(0, col).reduce((acc, val) => acc + val, 0);
    const y = row * cellHeight;
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fillRect(x, y, columnWidths[col], cellHeight);
    ctx.fillStyle = "black";
    // console.log(data);
  });

  if (currentCell) {
    let x = columnWidths.slice(0, currentCell[1]).reduce((acc, val) => acc + val, 0);
    const y = currentCell[0] * cellHeight;
    ctx.strokeStyle = "green";
    ctx.strokeRect(x, y, columnWidths[currentCell[1]], cellHeight);
    ctx.strokeStyle = "rgba(231,241,236,0.25)";
  }
  }
}
