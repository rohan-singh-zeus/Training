import { GridConstants } from "../constant/index.js";
import { Grid } from "./grid.js";
import { Excel } from "./excel.js";

export class RowGrid {
  constructor(canvasId, grid) {
    /**
     * @type {Excel}
     */
    this.excel = Excel.getInstance()
    /**
     * Canvas of the row Grid
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    /**
     * Default width of individual cell
     * @type {number}
     */
    this.defaultCellWidth = GridConstants.defaultCellWidth;
    /**
     * Default height of individual cell
     * @type {number}
     */
    this.cellHeight = GridConstants.cellHeight;
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
     * Array of widths of each column
     * @type {number[]}
     */
    this.columnWidths = this.excel.columnWidths;
    /**
     * Instance of the Grid class
     * @type {Grid}
     */
    this.grid = grid;

    this.init();
  }

  /**
   * Initializing the First Row and all the mouse events related to it
   * @returns {void}
   */
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
    document.addEventListener("DOMContentLoaded", this.drawHeaders.bind(this));
  }

  /**
   * Drawing the First Row
   * @returns {void}
   */
  drawHeaders() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px Calibri";
    let x = 0;
    for (let col = 0; col < this.numCols; col++) {
      const width = this.columnWidths[col];
      let char = String.fromCharCode(65 + col );
      this.ctx.fillStyle = "#F5F5F5";
      this.ctx.fillRect(x, 0, width, this.cellHeight);
      this.ctx.strokeStyle = "#b6b6b6";
      this.ctx.strokeRect(x, 0, width, this.cellHeight);
      this.ctx.fillStyle = "#000000";
      this.ctx.fillText(
        char,
        x + this.columnWidths[col] / 2,
        this.cellHeight / 2
      );

      x += width;
    }
  }

  drawRows() {
    let start = 0.5;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px Calibri";
    for (let i = 0; i < this.numCols; i++) {
      let char = String.fromCharCode(65 + i - 1);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.2;
      this.ctx.moveTo(start, 0);
      this.ctx.lineTo(start, this.cellHeight);
      this.ctx.fillText(
        char,
        start + this.columnWidths[i] / 2,
        this.cellHeight / 2
      );
      start += this.columnWidths[i];
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  /**
   *
   * Handle Pointer Down event
   * @param {PointerEvent} event
   * @returns {void}
   */
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
      this.drawHeaders();
      this.grid.drawGrid();
    }
  }

  /**
   *
   * Handle Pointer Move event
   * @param {PointerEvent} event
   * @returns {void}
   */
  handleMouseMove(event) {
    const { offsetX, offsetY } = event;

    if (this.isResizing) {
      const delta = offsetX - this.startX;
      this.columnWidths[this.resizeColIndex] += delta;
      this.startX = offsetX;
      this.drawHeaders();
      // this.grid.drawGrid()
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
      this.drawHeaders();
      this.grid.drawGrid();
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

  /**
   *
   * Handle Pointer up event
   * @param {PointerEvent} event
   * @returns {void}
   */
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
      this.grid.drawGrid();

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

  /**
   *
   * Updated selected row, column array for multiple selection
   * @param {number} start
   * @param {number} end
   * @returns {void}
   */
  updateSelectedCells(start, end) {
    this.selectedCells = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
    const colRange = [Math.min(startCol, endCol), Math.max(startCol, endCol)];

    for (let row = rowRange[0]; row <= rowRange[1]; row++) {
      for (let col = colRange[0]; col <= colRange[1]; col++) {
        this.selectedCells.push([row, col, this.gridData[row][col]]);
      }
    }
  }

  /**
   *
   * Generates different column names for each column
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
