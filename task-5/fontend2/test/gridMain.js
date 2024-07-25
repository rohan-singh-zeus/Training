import { Grid } from "./grid.js";

export class GridMain extends Grid {
  constructor(canvasId) {
    super();
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.selectedX = 0;
    this.selectedY = 0;
    

    this.init();
  }

  init() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    document.addEventListener("DOMContentLoaded", () => {
      this.drawMainGrid();
    });
  }

  drawMainGrid() {
    // this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)

    let cellPositionX = 0;
    let cellPositionY = 0;

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

    for (let y = 1; cellPositionY <= this.canvas.width; ++y) {
      cellPositionY += this.defCellHeight;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, cellPositionY + 0.5);
      this.ctx.lineTo(this.canvas.width, cellPositionY + 0.5);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.selectedCells.forEach(([row, col]) => {
      let x = this.colWidth.slice(0, col).reduce((acc, val) => acc + val, 0);
      const y = row * this.defCellHeight;
      this.ctx.strokeStyle = "rgb(0, 128, 0, 0.8)";
      this.ctx.strokeRect(x, y, this.defCellWidth, this.defCellHeight);
    });
    // if (this.isSelected) {
    //   // console.log(this.selectedX - this.defCellWidth, this.selectedY - this.defCellHeight);
    //   // this.ctx.fillStyle = "white";
    //   // this.ctx.fillRect(this.selectedX, this.selectedY, this.defCellWidth, this.defCellHeight);
    //   this.ctx.strokeStyle = "rgb(0, 128, 0, 0.8)";
    //   this.ctx.strokeRect(
    //     this.selectedX,
    //     this.selectedY,
    //     this.defCellWidth,
    //     this.defCellHeight
    //   );
    //   // this.ctx.fillStyle = "#000000";
    //   // this.ctx.font = "11px Arial";
    // }
  }

  handleMouseDown(e) {
    // this.ctx.clearRect(
    //   this.selectedX,
    //   this.selectedY,
    //   this.defCellWidth,
    //   this.defCellHeight
    // );
    // this.ctx.reset();
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)


    const { offsetX, offsetY } = e;
    // console.log(offsetX, offsetY);
    this.isSelected = true;
    this.isDragging = true;
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
    // console.log(row);
    this.selectedX = x - this.defCellWidth;
    this.selectedY = y - this.defCellHeight;
    this.startCell = [row, col];
    this.currentCell = [row, col];
    this.fillUpdatedCells(this.startCell, this.currentCell)
    this.drawMainGrid();
  }

  handleMouseMove(e) {
    const { offsetX, offsetY } = e;

    if (this.isDragging) {
      let col = 0;
      let x = 0;
      for (let i = 0; i < this.numCols; i++) {
        x += this.colWidth[i];
        if (offsetX < x) {
          col = i;
          break;
        }
      }
      const row = Math.floor(offsetY / this.defCellHeight);
      this.currentCell = [row, col];
      this.fillUpdatedCells(this.startCell, this.currentCell);
      this.drawMainGrid();
    }
  }

  handleMouseUp(e) {
    this.isDragging = false
  }

  handleDoubleClick(e){
    const { offsetX, offsetY } = e;
    const inpText = document.querySelector(".inpText")
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.numCols; i++) {
      x += this.colWidth[i];
      if (x > offsetX) {
        break;
      }
    }
    for (let j = 0; j < this.numRows; j++) {
      y += this.rowHeight[j];
      if (y > offsetY) {
        break;
      }
    }
    inpText.style.display = "inline-block"
    inpText.style.border = "none"
    inpText.style.outline = "none"
    inpText.style.padding = "0"
    inpText.style.backgroundColor = "transparent"
    inpText.style.height = `${this.defCellHeight}px`
    inpText.style.width = `${this.defCellWidth}px`
    inpText.style.position = "absolute"
    inpText.style.top = `${y}px`
    inpText.style.left = `${x - this.defCellWidth}px`
    console.log(x, y);
  }

  fillUpdatedCells(start, end) {
    this.selectedCells = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
    const colRange = [Math.min(startCol, endCol), Math.max(startCol, endCol)];

    for (let row = rowRange[0]; row <= rowRange[1]; row++) {
      for (let col = colRange[0]; col <= colRange[1]; col++) {
        this.selectedCells.push([row, col]);
      }
    }
  }
}
