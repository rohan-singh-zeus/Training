// import { Grid } from "./grid.js";

export class GridRow {
  constructor(
    canvasId,
    gMain,
    posX,
    numRows,
    numCols,
    defCellHeight,
    defCellWidth,
    colWidth,
    rowHeight,
    selectedCells,
    startCell,
    currentCell,
    isSelected,
    isDragging,
    isResizing,
    startX,
    resizeColIndex,
    rowSelected
  ) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.gMain = gMain;
    this.posX = posX;
    this.selectedX = 0;
    this.selectedY = 0;
    this.numRows = numRows;
    this.numCols = numCols;
    this.defCellHeight = defCellHeight;
    this.defCellWidth = defCellWidth;
    this.colWidth = colWidth;
    this.rowHeight = rowHeight;
    this.selectedCells = selectedCells;
    this.startCell = startCell;
    this.currentCell = currentCell;
    this.isSelected = isSelected;
    this.isDragging = isDragging;
    this.isResizing = isResizing;
    this.startX = startX;
    this.resizeColIndex = resizeColIndex;
    this.rowSelected = rowSelected

    this.init();
  }

  init() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDblClick.bind(this));
    // this.canvas.addEventListener("click", this.fixedColCanvasClick.bind(this))
    document.addEventListener("DOMContentLoaded", () => {
      this.drawRowGrid();
    });
  }

  drawRowGrid() {
    // console.log("drawGridCol called");
    this.ctx.reset();
    let cellPositionX = 0;
    // let cellPositionY = 0;
    for (let x = 0; cellPositionX <= this.canvas.width; ++x) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(cellPositionX + 0.5, 0);
      this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
      if(this.rowSelected[x]){
        
        // this.ctx.fillStyle = "lightgray";
        // this.ctx.fillRect(0, cellPositionX, this.colWidth[x], this.defCellHeight);
        console.log("Row selected");
      }
      this.ctx.fillStyle = "black";
      this.ctx.fillText(
        this.getColName(x),
        cellPositionX + this.defCellWidth / 2,
        this.defCellHeight / 2
      );
      cellPositionX += this.defCellWidth + this.posX[x];
      // console.log(cellPositionX);
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(cellPositionX + 0.5, 0);
    this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
    this.ctx.lineWidth = 0.4;
    this.ctx.strokeStyle = "#ccc";
    this.ctx.stroke();
    this.ctx.restore();


    // console.log(this.posX);
  }

  handleDblClick(e) {
    const { offsetX, offsetY } = e;
    // this.isSelected = true;
    // this.isDragging = true;
    // this.isResizing = true;
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
    console.log(row, col);
    this.rowSelected[col] = true
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
  }

  handleMouseMove(e) {
    const { offsetX, offsetY } = e;

    if (this.isResizing) {
      const delta = offsetX - this.startX;
      this.posX[this.resizeColIndex] += delta;
      this.colWidth[this.resizeColIndex] += delta;
      this.startX = offsetX;
      // this.gMain.drawMainGrid();
      this.drawRowGrid();
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

  handleMouseUp(e) {
    this.gMain.drawMainGrid();
    this.isResizing = false;
    const { offsetX, offsetY } = e;
    // this.isSelected = true;
    // this.isDragging = true;
    // this.isResizing = true;
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
    // console.log(row, col);
    if (row == 0) {
      // console.log("Row 0");
      this.updateSelectedCol(col);
      // console.log(this.selectedCells);
      this.highlightSelection();
      this.drawRowGrid();
      this.gMain.drawMainGrid();
    }
    // console.log(row);
    // this.startX = 0

    // console.log(this.posX);
  }

  updateSelectedCol(col) {
    this.selectedCells = [];
    for (let row = 0; row < this.numRows; row++) {
      this.selectedCells.push([row, col]);
    }
  }

  getColumnAtX(x) {
    let accumulatedWidth = 0;
    for (let i = 0; i < this.numCols; i++) {
      accumulatedWidth += this.colWidth[i];
      if (x < accumulatedWidth) return i;
    }
    return -1;
  }

  highlightSelection() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawGrid(this.data.map(() => true));
    // this.drawCellContents(this.data.map(() => true));

    if (this.selectedCells.length == 1) {
      this.ctx.fillStyle = "white";
      this.selectedCells.forEach((cell) => {
        // console.log(cell);
        const x = this.getColumnLeftPosition(cell[1]);
        const y = cell[0] * this.defCellHeight;
        this.ctx.fillRect(x, y, this.colWidth[cell[1]], this.defCellHeight);
      });
    }

    this.ctx.fillStyle = "rgb(0, 128, 0, 0.1)";
    this.selectedCells.slice(1).forEach((cell) => {
      const x = this.getColumnLeftPosition(cell[1]);
      const y = cell[0] * this.defCellHeight;
      this.ctx.fillRect(x, y, this.colWidth[cell[1]], this.defCellHeight);
    });

    if (this.selectedCells.length > 0) {
      // console.log("SJCBSJB");
      const minRow = Math.min(...this.selectedCells.map((cell) => cell[0]));
      const maxRow = Math.max(...this.selectedCells.map((cell) => cell[0]));
      const minCol = Math.min(...this.selectedCells.map((cell) => cell[1]));
      const maxCol = Math.max(...this.selectedCells.map((cell) => cell[1]));

      const xStart = this.getColumnLeftPosition(minCol);
      const yStart = minRow * this.defCellHeight;
      const xEnd = this.getColumnLeftPosition(maxCol) + this.colWidth[maxCol];
      const yEnd = (maxRow + 1) * this.defCellHeight;

      // border
      this.ctx.strokeStyle = "rgba(0, 128, 0, 0.8)";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
    }

    // this.drawCellContents(this.data.map(() => true));
  }

  getColumnLeftPosition(col) {
    let x = 0;
    for (let i = 0; i < col; i++) {
      x += this.colWidth[i];
    }
    return x;
  }

  getColName(n) {
    let columnName = "";
    while (n > 0) {
      let remainder = (n - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      n = Math.floor((n - 1) / 26);
    }
    return columnName;
  }
}
