export class RowGrid {
  constructor(canvasId, columnWidths, selectedCells, isDragging, isResizing, resizeColIndex, startX, startCell, currentCell, numRows, numCols, grid) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.defaultCellWidth = 100;
    this.cellHeight = 32;
    this.numRows = numRows;
    this.numCols = numCols;
    this.columnWidths = columnWidths;
    this.grid = grid

    this.init();
  }

  init() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    document.addEventListener("DOMContentLoaded", this.drawRow.bind(this));
  }

  drawRow() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let row = 0; row < 1; row++) {
      let x = 0;
      for (let col = 0; col < this.numCols; col++) {
        const width = this.columnWidths[col];
        // const y = row * cellHeight;
        this.ctx.fillStyle = "#F5F5F5";
        this.ctx.fillRect(x, 0, width, this.cellHeight);
        this.ctx.strokeStyle = "#b6b6b6";
        this.ctx.strokeRect(x, 0, width, this.cellHeight);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "11px Arial";
        this.ctx.fontWeight = "bold";
        this.ctx.fillText(this.getColName(col), x + 5, 20);

        x += width;
      }
    }
  }

  handleMouseDown(event) {
    const { offsetX, offsetY } = event;
    let col = 0;
    let x = 0;
    let y = 0;

    for (let i = 0; i < this.numCols; i++) {
      x += this.columnWidths[i];
      if (offsetX < x) {
        col = i;
        break;
      }
    }
    const row = Math.floor(offsetY / this.cellHeight);
    if (offsetX > x - 10 && offsetX < x + 10) {
      this.isResizing = true;
      this.resizeColIndex = col;
      this.startX = offsetX;
      this.canvas.style.cursor = "col-resize";
    } else {
      this.isDragging = true;
      this.startCell = [row, col];
      this.currentCell = [row, col];
      this.updateSelectedCells(this.startCell, this.currentCell);
      this.drawRow();
      this.grid.drawGrid()
    }
  }

  handleMouseMove(event) {
    const { offsetX, offsetY } = event;

    if (this.isResizing) {
      const delta = offsetX - this.startX;
      this.columnWidths[this.resizeColIndex] += delta;
      this.startX = offsetX;
      this.drawRow();
      this.grid.drawGrid()
    } else if (this.isDragging) {
      let col = 0;
      let x = 0;
      for (let i = 0; i < this.numCols; i++) {
        x += this.columnWidths[i];
        if (offsetX < x) {
          col = i;
          break;
        }
      }
      const row = Math.floor(offsetY / this.cellHeight);
      this.currentCell = [row, col];
      this.updateSelectedCells(this.startCell, this.currentCell);
      this.drawRow();
      this.grid.drawGrid()
    } else {
      let x = 0;
      for (let i = 0; i < this.numCols; i++) {
        x += this.columnWidths[i];
        if (offsetX > x - 5 && offsetX < x + 5) {
          this.canvas.style.cursor = "col-resize";
          return;
        }
      }
      this.canvas.style.cursor = "default";
    }
  }

  handleMouseUp(event) {
    const { offsetX, offsetY } = event;
    let col = 0;
    let x = 0;

    for (let i = 0; i < this.numCols; i++) {
      x += this.columnWidths[i];
      if (offsetX < x) {
        col = i;
        break;
      }
    }

    const row = Math.floor(offsetY / this.cellHeight);
    this.count = 0;
    this.sum = 0;
    this.avg = 0;
    this.min = 6555550;
    this.max = -6555550;
    if (this.isDragging) {
      this.isDragging = false;
      this.startCell = null;
      this.currentCell = null;
    }
    if (this.isResizing) {
      this.isResizing = false;
      this.canvas.style.cursor = "default";
    }
    if (this.selectedCells?.length > 0) {
      for (let i = 0; i < this.selectedCells.length; i++) {
        if (typeof this.selectedCells[i][2] === "number") {
          this.sum += this.selectedCells[i][2];
          this.count += 1;
          this.min = Math.min(this.min, this.selectedCells[i][2]);
          this.max = Math.max(this.max, this.selectedCells[i][2]);
        } else {
          continue;
        }
      }
      const sumText = document.querySelector(".sum");
      sumText.innerHTML = `Sum: <span>${this.sum}</span>`;
      const minText = document.querySelector(".min");
      minText.innerHTML = `Min: <span>${this.min}</span>`;
      const maxText = document.querySelector(".max");
      maxText.innerHTML = `Max: <span>${this.max}</span>`;
      const avgText = document.querySelector(".avg");
      avgText.innerHTML = `Average: <span>${this.sum / this.count}</span>`;
    }
    // if (row === 0) {
    //   this.updateSelectedCol(col);
    //   this.drawGrid();
    // }
    // if (col === 0) {
    //   this.updateSelectedRow(row);
    //   this.drawGrid();
    // }
  }

  updateSelectedCells(start, end) {
    this.selectedCells = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
    const colRange = [Math.min(startCol, endCol), Math.max(startCol, endCol)];

    for (let row = rowRange[0]; row <= rowRange[1]; row++) {
      for (let col = colRange[0]; col <= colRange[1]; col++) {
        this.selectedCells.push([row, col, this.gridData[row ][col ]]);
      }
    }
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
