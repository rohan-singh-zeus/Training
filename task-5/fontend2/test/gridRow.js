import { GridConstants } from '../constant/index.js';
import {GridMain} from './gridMain.js'

export class GridRow {
  constructor(
    canvasId,
    gMain,
    posX,
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
    /**
     * Canvas Id
     * @type {string}
     */
    this.canvasId = canvasId;
    /**
     * Row Canvas Element
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");
    /**
     * Main Canvas Element
     * @type {GridMain}
     */
    this.gMain = gMain;
    /**
     * Keeps track if any column is resized or not
     * @type {number[]}
     */
    this.posX = posX;
    
    this.selectedX = 0;
    this.selectedY = 0;
    /**
     * Total number of Rows
     * @type {number} 
     */
    this.numRows = GridConstants.numRows;
    /**
     * Total number of Columns
     * @type {number} 
     */
    this.numCols = GridConstants.numCols;
    /**
     * Default height of individual cell
     * @type {number} 
     */
    this.defCellHeight = GridConstants.defCellHeight;
    /**
     * Default width of individual cell
     * @type {number}
     */
    this.defCellWidth = GridConstants.defCellWidth;
    /**
     * Array of widths of each column
     * @type {number[]} 
     */
    this.colWidth = colWidth;
    /**
     * Array of heights of row
     * @type {number[]} 
     */
    this.rowHeight = rowHeight;
    /**
     * Array of selected cells for selection
     * @type {number[]}  
     */
    this.selectedCells = selectedCells;
    /**
     * Start row, col values for the cells to be selected in the format (row, col)
     * @type {number[]}  
     */
    this.startCell = startCell;
    /**
     * Current row, col values for the cells which are selected in the format (row, col)
     * @type {number[]}  
     */
    this.currentCell = currentCell;
    this.isSelected = isSelected;
    /**
     * Flag for if dragging for multiple selection or not
     * @type {boolean}  
     */
    this.isDragging = isDragging;
    /**
     * Flag for if resizing a column or not
     * @type {boolean}  
     */
    this.isResizing = isResizing;
    /**
     * Current col selected for resizing
     * @type {number} 
     */
    this.resizeColIndex = resizeColIndex;
    /**
     * Starting position of the column where we want to resize from
     * @type {number} 
     */
    this.startX = startX;
    this.rowSelected = rowSelected

    this.init();
  }

  /**
   * Initializing Row Grid Canvas
   * @returns {void}
   */
  init() {
    this.canvas.addEventListener("pointerdown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("pointermove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("pointerup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDblClick.bind(this));
    // this.canvas.addEventListener("click", this.fixedColCanvasClick.bind(this))
    document.addEventListener("DOMContentLoaded", () => {
      this.drawRowGrid();
    });
  }

  /**
   * Draw Row Grid Canvas
   * @returns {void}
   */
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

  /**
   * Handle Double click Operation
   * @param {PointerEvent} e 
   * @returns {void}
   */
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

  /**
   * Handle Mouse Down Operation
   * @param {PointerEvent} e 
   * @return {void}
   */
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

  /**
   * Handle Mouse move operation
   * @param {PointerEvent} e 
   * @returns {void}
   */
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

  /**
   * 
   * Handle Pointer up event
   * @param {PointerEvent} event  -
   * @returns {void} 
   */
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

  /**
   * 
   * Updated selected column array for multiple selection
   * @param {number} col 
   * @returns {void}
   */
  updateSelectedCol(col) {
    this.selectedCells = [];
    for (let row = 0; row < this.numRows; row++) {
      this.selectedCells.push([row, col]);
    }
  }

  /**
   * Get Column value based on x
   * @param {number} x 
   * @returns {number}
   */
  getColumnAtX(x) {
    let accumulatedWidth = 0;
    for (let i = 0; i < this.numCols; i++) {
      accumulatedWidth += this.colWidth[i];
      if (x < accumulatedWidth) return i;
    }
    return -1;
  }

  /**
   * Highlight the selected cells
   * @return {void}
   */
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

  /**
   * Get x position based on column value
   * @param {number} col 
   * @returns {number}
   */
  getColumnLeftPosition(col) {
    let x = 0;
    for (let i = 0; i < col; i++) {
      x += this.colWidth[i];
    }
    return x;
  }

  /**
   * Get random column names
   * @param {number} n 
   * @returns {string}
   */
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
