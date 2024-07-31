export class GridMain {
  constructor(
    canvasId,
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
    resizeColIndex
  ) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.selectedX = 0;
    this.selectedY = 0;
    this.posX = posX;
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
    this.isAnimated = false;
    this.dashOffset = 0;
    this.wafId = 0;
    this.xStart = 0;
    this.xEnd = 0;
    this.yStart = 0;
    this.yEnd = 0;

    this.init();
  }

  init() {
    this.canvas.addEventListener(
      "pointerdown",
      this.handleMouseDown.bind(this)
    );
    this.canvas.addEventListener(
      "pointermove",
      this.handleMouseMove.bind(this)
    );
    this.canvas.addEventListener("pointerup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    document.addEventListener("keydown", (e) => {
      // console.log(this.dashOffset);
      this.handleMarchingAnt(e);
    });
    document.addEventListener("DOMContentLoaded", () => {
      this.drawMainGrid();
      // this.handleDevicePixelRatio()
    });
  }

  drawMainGrid() {
    this.ctx.reset();
    let cellPositionX = 0;
    let cellPositionY = 0;
    for (let x = 0; cellPositionX <= this.canvas.width; ++x) {
      cellPositionX += this.defCellWidth + this.posX[x];
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(cellPositionX + 0.5, 0);
      this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
    }

    for (let y = 0; cellPositionY <= this.canvas.width; ++y) {
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

    this.highlightSelection();
  }

  handleDevicePixelRatio() {
    const dpx = window.devicePixelRatio;

    this.canvas.width = Math.floor(this.canvas.width * dpx);
    this.canvas.height = Math.floor(this.canvas.height * dpx);

    this.ctx.scale(dpx, dpx);
  }

  handleMouseDown(e) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.cancelAnimationFrame(this.wafId);

    const { offsetX, offsetY } = e;
    // console.log(offsetX, offsetY);
    this.isSelected = true;
    this.isDragging = true;
    this.isAnimated = false;

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
    this.selectedX = x - this.defCellWidth;
    this.selectedY = y - this.defCellHeight;
    this.startCell = [row, col];
    this.currentCell = [row, col];
    this.fillUpdatedCells(this.startCell, this.currentCell);
    this.highlightSelection();
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
      // console.log(this.selectedCells);
      this.highlightSelection();
      this.drawMainGrid();
    }
  }

  handleMouseUp(e) {
    this.isDragging = false;
    // console.log(this.selectedCells);
  }

  handleDoubleClick(e) {
    const { offsetX, offsetY } = e;
    const inpText = document.querySelector(".inpText");
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
    inpText.style.display = "inline-block";
    inpText.style.border = "none";
    inpText.style.outline = "none";
    inpText.style.padding = "0";
    inpText.style.backgroundColor = "transparent";
    inpText.style.height = `${this.defCellHeight}px`;
    inpText.style.width = `${this.defCellWidth}px`;
    inpText.style.position = "absolute";
    inpText.style.top = `${y}px`;
    inpText.style.left = `${x - this.defCellWidth}px`;
    // console.log(x, y);
  }

  getColumnLeftPosition(col) {
    let x = 0;
    for (let i = 0; i < col; i++) {
      x += this.colWidth[i];
    }
    return x;
  }

  march() {
    this.dashOffset++;
    if (this.dashOffset > 16) {
      this.dashOffset = 0;
    }
    this.drawDottedRect();
    this.wafId = window.requestAnimationFrame(() => {
      this.drawMainGrid();
      this.march();
    });
  }

  handleMarchingAnt(e) {
    if (e.key === "Control" && this.selectedCells.length > 1) {
      this.isAnimated = true;
      if (this.isAnimated) {
        window.cancelAnimationFrame(this.wafId);
      }
      this.march();
    }
  }

  highlightSelection() {
    if (this.selectedCells.length == 1) {
      // console.log("Highlight of len 1 called section called");

      this.ctx.fillStyle = "white";
      this.selectedCells.forEach((cell) => {
        // console.log(cell);
        const x = this.getColumnLeftPosition(cell[1]);
        const y = cell[0] * this.defCellHeight;
        this.ctx.fillRect(x, y, this.colWidth[cell[1]], this.defCellHeight);
        // console.log(x,y);
      });
    }

    this.ctx.fillStyle = "rgb(0, 128, 0, 0.1)";
    this.selectedCells.slice(1).forEach((cell) => {
      // console.log(cell[1]);
      const x = this.getColumnLeftPosition(cell[1]);
      const y = cell[0] * this.defCellHeight;
      this.ctx.fillRect(x, y, this.colWidth[cell[1]], this.defCellHeight);
      // console.log("Rectangle done");
    });

    if (this.selectedCells.length > 0) {
      const minRow = Math.min(...this.selectedCells.map((cell) => cell[0]));
      const maxRow = Math.max(...this.selectedCells.map((cell) => cell[0]));
      const minCol = Math.min(...this.selectedCells.map((cell) => cell[1]));
      const maxCol = Math.max(...this.selectedCells.map((cell) => cell[1]));

      this.xStart = this.getColumnLeftPosition(minCol);
      this.yStart = minRow * this.defCellHeight;
      this.xEnd = this.getColumnLeftPosition(maxCol) + this.colWidth[maxCol];
      this.yEnd = (maxRow + 1) * this.defCellHeight;

      // border
      if (this.isAnimated && this.selectedCells.length > 1) {
        this.drawDottedRect();
      } else {
        this.ctx.strokeStyle = "rgba(0, 128, 0, 0.8)";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          this.xStart,
          this.yStart,
          this.xEnd - this.xStart,
          this.yEnd - this.yStart
        );
      }
    }
  }

  drawDottedRect() {
    this.ctx.setLineDash([5,5]);
    this.ctx.lineDashOffset = -this.dashOffset;
    this.ctx.strokeStyle = "rgba(0, 128, 0, 0.9)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.xStart,
      this.yStart,
      this.xEnd - this.xStart,
      this.yEnd - this.yStart
    );
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
