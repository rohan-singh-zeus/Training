import { Grid } from "./grid.js";
import { GridMain } from "./gridMain.js";

export class GridRow extends Grid {
  constructor(canvasId) {
    super();
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    // this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    document.addEventListener("DOMContentLoaded", () => {
      this.drawRowGrid();
    });
  }

  drawRowGrid() {
    console.log("drawGridCol called");
    let cellPositionX = 0;
    // let cellPositionY = 0;
    for (let x = 1; cellPositionX <= this.canvas.width; ++x) {
      cellPositionX += this.defCellWidth;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(cellPositionX + 0.5, 0);
      this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(cellPositionX + 0.5, 0);
    this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
    this.ctx.lineWidth = 0.4;
    this.ctx.strokeStyle = "#ccc";
    this.ctx.stroke();
    this.ctx.restore();
  }

  handleMouseDown(e) {
    const { offsetX, offsetY } = e;
    this.isSelected = true;
    this.isDragging = true;
    this.isResizing = true;
    let x = 0;
    let y = 0;
    let col = 0;
    let row = 0;
    for (let i = 0; i < this.numCols; i++) {
      x += this.colWidth[i];
      if (x > offsetX) {
        // console.log(i);
        col = i;
        break;
      }
    }
    // console.log(offsetY);
    for (let j = 0; j < this.numRows; j++) {
      y += this.rowHeight[j];
      if (y > offsetY) {
        // console.log(j);
        row = j;
        break;
      }
    }
    if (offsetX > x - 10 && offsetX < x + 10) {
      console.log("called");
      this.isResizing = true;
      this.resizeColIndex = col;
      this.startX = offsetX;
      this.canvas.style.cursor = "col-resize";
    }
    // console.log(x,y);
    // console.log(row, col);
  }

  handleMouseMove(e) {
    console.log("Mousemove called");
    const { offsetX, offsetY } = e;

    if (this.isResizing) {
      const delta = offsetX - this.startX;
      this.colWidth[this.resizeColIndex] += delta;
      this.startX = offsetX;
      this.drawRowGrid();
      new GridMain("gridMain").drawMainGrid()
      // } else if (this.isDragging) {
      //   let col = 0;
      //   let x = 0;
      //   for (let i = 0; i < this.numCols; i++) {
      //     x += this.columnWidths[i];
      //     if (offsetX < x) {
      //       col = i;
      //       break;
      //     }
      //   }
      //   const row = Math.floor(offsetY / this.cellHeight);
      //   this.currentCell = [row, col];
      //   this.updateSelectedCells(this.startCell, this.currentCell);
      //   this.drawGrid();
    } else {
      let x = 0;
      for (let i = 0; i < this.numCols; i++) {
        x += this.colWidth[i];
        if (offsetX > x - 5 && offsetX < x + 5) {
          this.canvas.style.cursor = "col-resize";
          return;
        }
      }
      this.canvas.style.cursor = "default";
    }
  }

  handleMouseUp(e) {}
}
