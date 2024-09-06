import { GridConstants } from "../constant/index.js";
import { Dimension } from "./dimension.js";
import { CustomDictionary } from "./ds.js";
import { Excel } from "./excel.js";
import { Graph } from "./graph.js";
import { GridFunctionalities } from "./gridFunctionalities.js";
import { NotificationToast } from "./notification.js";

export class GridTest2 {
  constructor(canvasId) {
    /**
     * @type {Excel}
     */
    this.excel = Excel.getInstance();
    /**
     * Canvas of the main Grid
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
     * Array of heights of row
     * @type {number[]}
     */
    this.rowHeights = Array(this.numRows).fill(this.cellHeight);
    /**
     * Stores the data in 2-D Array
     * @type {string[][]}
     */
    // this.gridData = [];
    this.gridData = Array.from({ length: this.numRows }, () =>
      Array(this.numCols).fill("")
    );

    /**
     * Number of Columns for the first column
     * @type {number[]}
     */
    this.gridCols = [];
    /**
     * Number of Rows for the first Row
     * @type {number[]}
     */
    this.gridRows = [];
    /**
     * Array of selected cells for selection
     * @type {number[]}
     */
    this.selectedCells = this.excel.selectedCells;
    /**
     * Array of selected data for Graph construction
     * @type {number[]}
     */
    this.cellsData = this.excel.cellsData;
    /**
     * Array of selected data columns for Graph construction
     * @type {number[]}
     */
    this.cellsCol = this.excel.cellsCol;
    /**
     * Flag for if dragging for multiple selection or not
     * @type {boolean}
     */
    this.isDragging = this.excel.isDragging;
    /**
     * Flag for if resizing a column or not
     * @type {boolean}
     */
    this.isResizing = this.excel.isResizing;
    /**
     * Current col selected for resizing
     * @type {number}
     */
    this.resizeColIndex = this.excel.resizeColIndex;
    /**
     * Starting position of the column where we want to resize from
     * @type {number}
     */
    this.startX = this.excel.startX;
    /**
     * Start row, col values for the cells to be selected in the format (row, col)
     * @type {number[]}
     */
    this.startCell = this.excel.startCell;
    /**
     * Current row, col values for the cells which are selected in the format (row, col)
     * @type {number[]}
     */
    this.currentCell = this.excel.currentCell;
    this.copiedCells = [];
    /**
     * Value of sum of selected values
     * @type {number}
     */
    this.sum = 0;
    /**
     * Value of min of selected values
     * @type {number}
     */
    this.min = 0;
    /**
     * Value of max of selected values
     * @type {number}
     */
    this.max = 0;
    /**
     * Value of average of selected values
     * @type {number}
     */
    this.avg = 0;
    /**
     * Value of count of selected values
     * @type {number}
     */
    this.count = 0;
    /**
     * Array of filtered rows when using Find function
     * @type {number[]}
     */
    this.filteredRows = null;

    /**
     * @type {HTMLElement}
     */
    this.graph = document.querySelector(".graph");

    /**
     * @type {number[][]}
     */
    this.pasteData = null;

    /**
     * Initial row, col for copy paste
     * @type {number[]}
     */
    this.initialCell = [0, 0];

    /**
     * Final row, col for copy paste
     * @type {number[]}
     */
    this.finalCell = [0, 0];

    // /**
    //  * @type {number[][]}
    //  */
    this.copyCutData = [];

    this.currentRow = 0;
    this.currentCol = 0;

    /**
     * @type {CustomDictionary}
     */
    this.customDict = CustomDictionary.getInstance();

    /**
     * @type {GridFunctionalities}
     */
    this.gridFunctionalities = GridFunctionalities.getInstance();

    /**
     * @type {HTMLElement}
     */
    this.cellInput = document.getElementById("cellInput");

    /**
     * Flag for starting the marching ants animation
     * @type {boolean}
     */
    this.isAnimated = false;

    this.dashOffset = 0;
    /**
     * Request animation frame id
     * @type {number}
     */
    this.wafId = 0;
    /**
     * @type {number}
     */
    this.xStart = 0;
    /**
     * @type {number}
     */
    this.xEnd = 0;
    /**
     * @type {number}
     */
    this.yStart = 0;
    /**
     * @type {number}
     */
    this.yEnd = 0;

    /**
     * @type {HTMLCanvasElement}
     */
    this.rowCountCanvas = document.getElementById("gridCanvas3");
    this.rowCountCtx = this.rowCountCanvas.getContext("2d");

    /**
     * @type {HTMLCanvasElement}
     */
    this.columnCanvas = document.getElementById("gridCanvas2");
    this.columnCtx = this.columnCanvas.getContext("2d");

    /**
     * @type {Dimension}
     */
    this.dimension = Dimension.getInstance();
    this.emailSelected = null;

    this.init();
  }

  /**
   * Initializing the whole Excel and all the mouse events related to it
   * @returns {void}
   */
  init() {
    ["pointerdown", "pointermove", "pointerup", "dblclick"].forEach((type) => {
      this.canvas.addEventListener(type, this.handleEvent.bind(this));
    });
    document.addEventListener("keydown", this.handleEvent.bind(this));
    this.cellInput.addEventListener("blur", () => {
      this.saveInputValue();
    });
    this.cellInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.saveInputValue();
      }
    });

    this.rowCountCanvas.addEventListener("pointerup", (ev) => {
      const { offsetY } = ev;
      // let col = this.getColumnFromX(offsetX);
      let row = this.getRowFromY(offsetY);
      // console.log(row, col);
      this.updateSelectedRow(row);
      this.drawGrid();
      this.drawIds();
      this.drawHeaders();
    });

    this.columnCanvas.addEventListener(
      "pointerdown",
      this.handleColumnMouseDown.bind(this)
    );
    this.columnCanvas.addEventListener(
      "pointermove",
      this.handleColumnMouseMove.bind(this)
    );
    this.columnCanvas.addEventListener(
      "pointerup",
      this.handleColumnMouseUp.bind(this)
    );

    this.rowCountCanvas.addEventListener("pointerdown", (ev) => {
      let row = this.getRowFromY(ev.offsetY);
      this.emailSelected = this.gridData[row - 1][0];
    });

    document.addEventListener("DOMContentLoaded", this.handleEvent.bind(this));
  }

  /**
   * Getting data from backend the populating the Grid
   * @returns {void}
   */
  async fetchDataAndPopulateGrid() {
    try {
      const res = await fetch("test.json");
      const data = await res.json();
      console.log(data);

      // this.gridData.length = 0;
      Object.keys(data[0]).forEach((d, i) => {
        this.gridCols.push(d);
      });
      data.forEach((row, rowIndex) => {
        this.gridData[rowIndex] = Object.values(row);
        this.gridRows.push(rowIndex);
      });
      this.drawGrid();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  /**
   * Debounce function to prevent excessive calls
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * Fetch data from backend through lazy loading
   * @param {number} from
   * @param {number} to
   * @returns {void}
   */
  async fetchData(from, to) {
    try {
      const res = await fetch(`https://localhost:7210/lazy/${from}/${to}`);
      const data = await res.json();
      Object.keys(data[0]).forEach((d, i) => {
        this.gridCols.push(d);
      });
      data.forEach((row, rowIndex) => {
        this.gridData[rowIndex] = Object.values(row);
        this.gridRows.push(rowIndex);
      });
      this.drawGrid();
    } catch (error) {
      this.drawGrid();

      console.error("Error fetching data:", error);
    }
  }

  fetchActualData = this.debounce(this.fetchData, 300);

  /**
   *
   * @param {Event} event
   */
  handleEvent(event) {
    switch (event.type) {
      case "pointerdown":
        this.handleMouseDown(event);
        break;
      case "pointermove":
        this.handleMouseMove(event);
        break;
      case "pointerup":
        this.handleMouseUp(event);
        break;
      case "dblclick":
        this.handleDoubleClick(event);
        break;
      case "keydown":
        this.handleKeyPress(event);
        break;
      case "DOMContentLoaded":
        this.fetchActualData(0, 100);
        this.drawIds();
        this.drawHeaders();
        break;
      default:
        break;
    }
  }

  /**
   *
   * Handle Pointer Down event
   * @param {PointerEvent} event
   * @returns {void}
   */
  handleColumnMouseDown(event) {
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
    if (offsetX > x - 5 && offsetX < x + 5) {
      this.isResizing = true;
      this.resizeColIndex = col;
      this.startX = offsetX;
      this.columnCanvas.style.cursor = "col-resize";
    }
  }

  /**
   *
   * Handle Pointer Move event
   * @param {PointerEvent} event
   * @returns {void}
   */
  handleColumnMouseMove(event) {
    const { offsetX, offsetY } = event;
    const { movementX, movementY } = event;

    if (this.isResizing) {
      const delta = movementX;
      this.columnWidths[this.resizeColIndex] = Math.max(
        20,
        this.columnWidths[this.resizeColIndex] + delta
      );
      this.drawHeaders();
    } else {
      let x = 0;
      for (let i = 0; i < this.numCols; i++) {
        x += this.columnWidths[i];
        if (offsetX > x - 5 && offsetX < x + 5) {
          this.columnCanvas.style.cursor = "col-resize";
          return;
        }
      }
      this.columnCanvas.style.cursor = "default";
    }
  }

  /**
   *
   * Handle Pointer up event
   * @param {PointerEvent} event
   * @returns {void}
   */
  handleColumnMouseUp(event) {
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
    if (this.isResizing) {
      this.drawGrid();
      this.isResizing = false;
      this.columnCanvas.style.cursor = "default";
    }
  }

  /**
   * Handle Pointer Down event with line-based grid
   * @param {PointerEvent} event
   * @returns {void}
   */
  handleMouseDown(event) {
    const { offsetX, offsetY } = event;
    this.graph.style.display = "none";
    window.cancelAnimationFrame(this.wafId);
    this.isAnimated = false;

    let col = this.getColumnFromX(offsetX);
    let row = this.getRowFromY(offsetY);

    if (col !== -1 && row !== -1) {
      this.isDragging = true;
      this.startCell = [row, col];
      this.currentCell = [row, col];
      this.initialCell = [row, col];
      this.finalCell = [row, col];
      this.updateSelectedCells(this.startCell, this.currentCell);
      this.drawGrid();
    }

    this.cellsData = [];
    this.cellsCol = [];
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
      // const delta = offsetX - this.startX;
      // this.columnWidths[this.resizeColIndex] += delta;
      // this.startX = offsetX;
      //   this.drawGrid();
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
      this.finalCell = [row, col];
      this.updateSelectedCells(this.startCell, this.currentCell);
      this.drawGrid();
    } else {
      // let x = 0;
      // for (let i = 0; i < this.numCols; i++) {
      //   x += this.columnWidths[i];
      //   if (offsetX > x - 5 && offsetX < x + 5) {
      //     this.canvas.style.cursor = "col-resize";
      //     return;
      //   }
      // }
      // this.canvas.style.cursor = "default";
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
    this.isAnimated = false;
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
      // this.isResizing = false;
      // this.canvas.style.cursor = "default";
    }
    if (this.selectedCells.length > 0) {
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
      sumText.innerHTML = `Sum: <span>${this.sum.toFixed(2)}</span>`;
      const minText = document.querySelector(".min");
      minText.innerHTML = `Min: <span>${this.min}</span>`;
      const maxText = document.querySelector(".max");
      maxText.innerHTML = `Max: <span>${this.max}</span>`;
      const avgText = document.querySelector(".avg");
      avgText.innerHTML = `Average: <span>${(this.sum / this.count).toFixed(
        2
      )}</span>`;
      for (let i = 0; i < this.selectedCells.length; i++) {
        this.cellsData.push(this.selectedCells[i][2]);
        this.cellsCol.push(i);
      }
    }
    if (row === 0) {
      this.updateSelectedCol(col);
      this.drawGrid();
    }
    // if (col === 0) {
    //   this.updateSelectedRow(row);
    //   this.drawGrid();
    // }
  }

  /**
   * Handle any key press event
   * @param {KeyboardEvent} ev
   */
  handleKeyPress(ev) {
    if (ev.ctrlKey && (ev.key === "c" || ev.key === "C")) {
      this.handleCopyFromGrid();
    } else if (
      ev.ctrlKey &&
      (ev.key === "b" || ev.key === "B") &&
      this.selectedCells.length > 1
    ) {
      this.handleMarchingAnt();
    } else if (ev.altKey && (ev.key === "c" || ev.key === "C")) {
      this.updateCellsCall();
    } else if (ev.ctrlKey && (ev.key === "v" || ev.key === "V")) {
      this.handlePasteToGrid();
    } else if (ev.ctrlKey && (ev.key === "x" || ev.key === "X")) {
      this.handleDeleteFromGrid();
    } else if (ev.key === "Delete") {
      this.handleDeleteRow();
    } else {
    }
  }

  /**
   *
   * Handle Double click event
   * @param {PointerEvent} event  -
   * @returns {void}
   */
  handleDoubleClick(event) {
    const { offsetX, offsetY } = event;

    const col = this.getColumnFromX(offsetX);
    const row = this.getRowFromY(offsetY);

    if (col !== -1 && row !== -1) {
      // Calculate cell position and dimensions
      const cellX = this.columnWidths
        .slice(0, col)
        .reduce((acc, val) => acc + val, 0);
      const cellY = this.rowHeights
        .slice(0, row)
        .reduce((acc, val) => acc + val, 0);
      const cellWidth = this.columnWidths[col];
      const cellHeight = this.rowHeights[row];

      // Position the input box
      this.cellInput.style.left = `${cellX + 30}px`;
      this.cellInput.style.top = `${cellY + 30}px`;
      this.cellInput.style.width = `${cellWidth}px`;
      this.cellInput.style.height = `${cellHeight}px`;
      this.cellInput.style.display = "block";
      this.cellInput.value =
        this.gridData[row - 1] && this.gridData[row - 1][col]
          ? this.gridData[row - 1][col]
          : "";
      this.cellInput.focus();

      // Store the current cell coordinates
      this.currentCell = { row, col };
    }
  }

  /**
   * Helper function for drawing cells
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @returns {void}
   */
  drawCell(x, y, width, height, text) {
    // if (text === "email") {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(x + 0.5, y + 0.5, width, height);
    this.ctx.strokeStyle = "#dfdfde";
    this.ctx.strokeRect(x + 0.5, y + 0.5, width, height);
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "11px Arial";
    this.ctx.fillText(text, x + 5, y + 20);
    // }
  }

  /**
   * Drawing the First Row
   * @returns {void}
   */
  drawFirstRow() {
    let x = 0;

    this.ctx.lineWidth = 1;
    for (let col = 0; col < this.numCols; col++) {
      const width = this.columnWidths[col];
      const text = this.gridCols[col] || "";
      //   console.log(text);

      this.drawCell(x, 0, width, this.cellHeight, text);
      x += width;
    }
  }

  drawIds() {
    this.rowCountCtx.clearRect(
      0,
      0,
      this.rowCountCanvas.width,
      this.rowCountCanvas.height
    );
    this.rowCountCtx.textAlign = "center";
    this.rowCountCtx.textBaseline = "middle";
    this.rowCountCtx.font = "10px Calibri";
    this.rowCountCtx.fillStyle = "black";

    this.rowCountCtx.lineWidth = 0.2;
    let start = 0.5;
    for (let i = 0; i < this.numRows; i++) {
      this.rowCountCtx.save();
      this.rowCountCtx.beginPath();
      this.rowCountCtx.moveTo(0, start);
      this.rowCountCtx.lineTo(this.cellHeight, start);
      start += this.rowHeights[i];
      this.rowCountCtx.fillText(
        i,
        this.cellHeight / 2,
        start - this.rowHeights[i] / 2
      );
      this.rowCountCtx.stroke();
      this.rowCountCtx.restore();
    }
    this.rowCountCtx.beginPath();
    this.rowCountCtx.moveTo(30 + 0.5, 0);
    this.rowCountCtx.lineTo(30 + 0.5, this.rowCountCanvas.height + 0.5);
    this.rowCountCtx.stroke();
  }

  /**
   * Drawing the First Row
   * @returns {void}
   */
  drawHeaders() {
    this.columnCtx.clearRect(
      0,
      0,
      this.columnCanvas.width,
      this.columnCanvas.height
    );
    this.columnCtx.textAlign = "center";
    this.columnCtx.textBaseline = "middle";
    this.columnCtx.font = "12px Calibri";
    this.columnCtx.fillStyle = "black";
    this.columnCtx.lineWidth = 0.2;
    let start = 0.5;
    for (let i = 0; i < this.numCols; i++) {
      let char = String.fromCharCode(65 + i);
      this.columnCtx.save();
      this.columnCtx.beginPath();
      this.columnCtx.moveTo(start, 0);
      this.columnCtx.lineTo(start, this.cellHeight);
      this.columnCtx.fillText(
        char,
        start + this.columnWidths[i] / 2,
        this.cellHeight / 2
      );
      start += this.columnWidths[i];
      this.columnCtx.stroke();
      this.columnCtx.restore();
    }
    this.columnCtx.beginPath();
    this.columnCtx.moveTo(0, this.cellHeight + 0.5);
    this.columnCtx.lineTo(this.cellHeight + 0.5, this.columnCanvas.width);
    this.columnCtx.stroke();
  }

  /**
   * Drawing the Main Grid as a line-based grid
   * @returns {void}
   */
  drawGrid() {
    // console.log(
    //   this.excel.rHeightPrefixSum[this.excel.rHeightPrefixSum.length - 1]
    // );
    // console.log("Draw Grid called");

    // Clear the existing grid
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 1;
    // Draw vertical lines
    let x = 0; // Start after the first column header
    for (let col = 0; col <= this.numCols; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.canvas.height);
      this.ctx.strokeStyle = "#dfdfde"; // Grid line color
      this.ctx.stroke();
      x += this.columnWidths[col] || this.defaultCellWidth;
      this.excel.cWidthPrefixSum.push(x);
    }

    // // Draw horizontal lines
    // let y = this.excel.rHeightPrefixSum[this.excel.rHeightPrefixSum.length - 1]; // Start after the first row header
    // for (let row = this.excel.topIndex; row <= this.excel.bottomIndex; row++) {
    //   //   this.ctx.beginPath();
    //   //   this.ctx.moveTo(0, y + 0.5);
    //   //   this.ctx.lineTo(this.canvas.width, y + 0.5);
    //   //   this.ctx.strokeStyle = "#dfdfde"; // Grid line color
    //   //   this.ctx.stroke();
    //   this.drawLines(0, y + 0.5);
    //   y += this.rowHeights[row] || this.cellHeight;
    //   this.excel.rHeightPrefixSum.push(y);
    // }
    let y = 0; // Start after the first row header
    for (let row = 0; row <= this.numRows; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.canvas.width, y + 0.5);
      this.ctx.strokeStyle = "#dfdfde"; // Grid line color
      this.ctx.stroke();
      //   this.drawLines(0, y + 0.5);
      y += this.rowHeights[row] || this.cellHeight;
      this.excel.rHeightPrefixSum.push(y);
    }

    // Highlight selected cells
    this.highlightSelectedCells();

    // Draw cell data
    this.ctx.font = `${14}px Arial`;
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    // this.ctx.font = "14px Calibri";
    this.ctx.fontWeight = "600";
    this.gridData.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, colIndex) => {
        if (cellData) {
          const cellX = this.columnWidths
            .slice(0, colIndex)
            .reduce((acc, val) => acc + val, 0);
          const cellY = (rowIndex + 1) * this.cellHeight + 20; // Adjust to center text vertically

          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.rect(
            cellX,
            cellY - this.rowHeights[rowIndex] / 2,
            this.columnWidths[colIndex] - 10,
            this.rowHeights[rowIndex]
          );
          this.ctx.clip();

          this.ctx.fillText(cellData, cellX + 5, cellY); // 5px padding
          this.ctx.restore();
        }
      });
    });
    this.drawFirstRow();
  }

  drawLines(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(this.canvas.width, y);
    this.ctx.strokeStyle = "#dfdfde"; // Grid line color
    this.ctx.stroke();
  }

  /**
   * Highlight the selected cells in the line-based grid
   * @returns {void}
   */
  highlightSelectedCells() {
    if (this.selectedCells.length == 1) {
      this.ctx.fillStyle = "transparent";
      this.selectedCells.forEach((cell) => {
        const x = this.getColumnLeftPosition(cell[1]);
        const y = cell[0] * this.cellHeight;
        this.ctx.fillRect(x, y, this.columnWidths[cell[1]], this.cellHeight);

        this.drawIds();
        this.rowCountCtx.fillStyle = "rgb(0, 128, 0, 0.5)";
        this.rowCountCtx.fillRect(0, y, 30, this.cellHeight);

        this.drawHeaders();
        this.columnCtx.fillStyle = "rgb(0, 128, 0, 0.5)";
        this.columnCtx.fillRect(
          x,
          0,
          this.columnWidths[cell[1]],
          this.cellHeight
        );
      });
    }

    this.ctx.fillStyle = "rgb(0, 128, 0, 0.1)";
    this.selectedCells.slice(1).forEach((cell) => {
      const x = this.getColumnLeftPosition(cell[1]);
      const y = cell[0] * this.cellHeight;
      this.ctx.fillRect(x, y, this.columnWidths[cell[1]], this.cellHeight);
    });

    if (this.selectedCells.length > 0) {
      const minRow = Math.min(...this.selectedCells.map((cell) => cell[0]));
      const maxRow = Math.max(...this.selectedCells.map((cell) => cell[0]));
      const minCol = Math.min(...this.selectedCells.map((cell) => cell[1]));
      const maxCol = Math.max(...this.selectedCells.map((cell) => cell[1]));

      this.xStart = this.getColumnLeftPosition(minCol);
      this.yStart = minRow * this.cellHeight;
      this.xEnd =
        this.getColumnLeftPosition(maxCol) + this.columnWidths[maxCol];
      this.yEnd = (maxRow + 1) * this.cellHeight;

      this.drawIds();
      this.rowCountCtx.fillStyle = "rgb(0, 128, 0, 0.3)";
      this.rowCountCtx.strokeStyle = "rgba(0, 128, 0)";
      this.rowCountCtx.lineWidth = 5;
      this.rowCountCtx.fillRect(0, this.yStart, 30, this.yEnd - this.yStart);
      this.rowCountCtx.beginPath();
      this.rowCountCtx.moveTo(30 + 0.5, this.yStart);
      this.rowCountCtx.lineTo(30 + 0.5, this.yEnd + 0.5);
      this.rowCountCtx.stroke();

      this.drawHeaders();
      this.columnCtx.fillStyle = "rgb(0, 128, 0, 0.3)";
      this.columnCtx.strokeStyle = "rgba(0, 128, 0)";
      this.columnCtx.lineWidth = 5;
      this.columnCtx.fillRect(
        this.xStart,
        0,
        this.xEnd - this.xStart,
        this.cellHeight
      );
      this.columnCtx.beginPath();
      this.columnCtx.moveTo(this.xStart, 30 + 0.5);
      this.columnCtx.lineTo(this.xEnd + 0.5, 30 + 0.5);
      this.columnCtx.stroke();

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

  /**
   * Get x position based on column value
   * @param {number} col
   * @returns {number}
   */
  getColumnLeftPosition(col) {
    let x = 0;
    for (let i = 0; i < col; i++) {
      x += this.columnWidths[i];
    }
    return x;
  }

  /**
   * Network call to bulk update
   * @returns {void}
   */
  async updateCellsCall() {
    // console.log(Object.fromEntries(this.customDict.getAll()));
    try {
      const res = await fetch(
        "https://localhost:7210/api/TodoItems/updateCells",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(this.customDict.getAll())),
        }
      );
      const data = await res.json();
      new NotificationToast(
        "Cells updated successfully",
        900,
        10,
        "linear-gradient(to right, #00b09b, #96c93d)",
        "success"
      );
      //   alert("Cells updated successfully");
      console.log(data);
    } catch (error) {
      console.log(error);
      new NotificationToast("Something went wrong", 900, 10, "red", "error",);
    }
  }

  async handleDeleteRow() {
    if (this.emailSelected === null) {
      alert("No row selected");
      return;
    }

    this.handleDeleteFromGrid()

    try {
      const res = await fetch(
        `https://localhost:7210/row/${this.emailSelected}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        new NotificationToast(
          "Deleted row successfully",
          900,
          10,
          "linear-gradient(to right, #00b09b, #96c93d)",
          "success"
        );
        this.emailSelected = null;
      }
    } catch (error) {
      console.log(error);
        new NotificationToast("Something went wrong", 900, 10, "red", "error");
    }
  }

  /**
   * Save input value to particular cell
   * @returns {void}
   */
  saveInputValue() {
    const { row, col } = this.currentCell;
    const value = this.cellInput.value;
    // Ensure gridData array has the appropriate size
    if (!this.gridData[row - 1]) {
      this.gridData[row - 1] = [];
    }
    this.gridData[row - 1][col] = value;
    this.addToDict(row, col);
    this.cellInput.style.display = "none";
    this.drawGrid();
  }

  /**
   * Add value to CustomDictionary data structure
   * @param {number} row
   * @param {number} col
   * @returns {void}
   */
  addToDict(row, col) {
    let existingEntry = this.customDict.get(this.gridData[row - 1][0]);
    if (!existingEntry) {
      existingEntry = [];
    }
    existingEntry.push({
      [this.gridCols[col]]: this.gridData[row - 1][col],
    });
    this.customDict.add(this.gridData[row - 1][0], existingEntry);
  }

  /**
   * Get the column index based on the x-coordinate
   * @param {number} x
   * @returns {number}
   */
  getColumnFromX(x) {
    let totalWidth = 0;
    for (let i = 0; i < this.numCols; i++) {
      totalWidth += this.columnWidths[i] || this.defaultCellWidth;
      if (x < totalWidth) {
        return i;
      }
    }
    return -1; // If x is beyond the last column
  }

  /**
   * Get the row index based on the y-coordinate
   * @param {number} y
   * @returns {number}
   */
  getRowFromY(y) {
    let totalHeight = 0;
    for (let i = 0; i < this.numRows; i++) {
      totalHeight += this.rowHeights[i] || this.cellHeight;
      if (y < totalHeight) {
        return i;
      }
    }
    return -1; // If y is beyond the last row
  }

  handleCopyFromGrid() {
    this.copyCutData = []
    const selectedString = this.gridFunctionalities.handleCopyToClipBoard(
      this.initialCell,
      this.finalCell,
      this.gridData
    );
    let transfromToMatrixHelper = selectedString.split("-}");
    for (
      let rowIndex = 0;
      rowIndex + 1 < transfromToMatrixHelper.length;
      ++rowIndex
    ) {
      let temp = transfromToMatrixHelper[rowIndex].split("-->");
      this.copyCutData.push(temp);
    }
  }

  async handlePasteToGrid() {
    let [rowStart, colStart, rowEnd, colEnd] =
      this.gridFunctionalities.getRowColStartEnd(
        this.initialCell,
        this.finalCell
      );
    for (let i = 0; i < this.copyCutData.length; i++) {
      for (let j = 0; j < this.copyCutData[i].length; j++) {
        this.gridData[i + rowStart - 1][j + colStart] = this.copyCutData[i][j];
        this.addToDict(i + rowStart, j + colStart);
      }
    }
    this.drawGrid();
  }

  handleDeleteFromGrid() {
    this.copyCutData = [];
    this.handleCopyFromGrid();
    let [rowStart, colStart, rowEnd, colEnd] =
      this.gridFunctionalities.getRowColStartEnd(
        this.initialCell,
        this.finalCell
      );
    for (let i = 0; i < this.copyCutData.length; i++) {
      for (let j = 0; j < this.copyCutData[i].length; j++) {
        this.gridData[i + rowStart - 1][j + colStart] = "";
        this.addToDict(i + rowStart, j + colStart);
      }
    }
    this.drawGrid();
  }

  /**
   * Handles Marching Ant Animation logic
   * @returns {void}
   */
  handleMarchingAnt() {
    this.isAnimated = true;
    if (this.isAnimated) {
      window.cancelAnimationFrame(this.wafId);
    }
    this.march();
  }

  /**
   * This enables marching animation through recursion
   * @returns {void}
   */
  march() {
    this.dashOffset++;
    if (this.dashOffset > 16) {
      this.dashOffset = 0;
    }
    this.drawDottedRect();
    this.wafId = window.requestAnimationFrame(() => {
      this.drawGrid();
      this.march();
    });
  }

  /**
   * Draw Rectangle with dotted stroke
   * @returns {void}
   */
  drawDottedRect() {
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineDashOffset = -this.dashOffset;
    this.ctx.strokeStyle = "rgba(0, 128, 0, 0.9)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.xStart,
      this.yStart,
      this.xEnd - this.xStart,
      this.yEnd - this.yStart
    );
    this.ctx.setLineDash([]);
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
      this.selectedCells.push([row, col, this.gridData[row][col - 1]]);
    }
  }

  /**
   *
   * Updated selected row array for multiple selection
   * @param {number} row
   * @returns {void}
   */
  updateSelectedRow(row) {
    this.selectedCells = [];
    for (let col = 0; col < this.numCols; col++) {
      this.selectedCells.push([row, col, this.gridData[row][col]]);
    }
  }

  /**
   *
   * Updated selected row, column array for multiple selection
   * @param {number} start
   * @param {number} end
   * @returns {void}
   */
  updateSelectedCells(startCell, endCell) {
    const [startRow, startCol] = startCell;
    const [endRow, endCol] = endCell;
    this.selectedCells = [];

    for (
      let row = Math.min(startRow, endRow);
      row <= Math.max(startRow, endRow);
      row++
    ) {
      for (
        let col = Math.min(startCol, endCol);
        col <= Math.max(startCol, endCol);
        col++
      ) {
        const x = this.columnWidths
          .slice(0, col)
          .reduce((acc, val) => acc + val, 0);
        const y = row * this.cellHeight;
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(x, y, this.columnWidths[col], this.cellHeight);
        this.selectedCells.push([row, col, this.gridData[row - 1][col]]);
      }
    }
  }

  /**
   *
   * Filter rows based on a value for Find function
   * @param {*} findValue
   * @returns {void}
   */
  filterRows(findValue) {
    this.filteredRows = [];
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.gridData[row][col] === findValue) {
          this.filteredRows.push(row);
          break;
        }
      }
    }
  }

  /**
   * Clearing the filtered Rows
   * @returns {void}
   */
  clearFilter() {
    this.filteredRows = null;
  }

  /**
   * Constructing Bar Graph based on the selected values
   * @returns {void}
   * @returns {void}
   */
  constructBar() {
    if (!this.graphInst) {
      this.graphInst = new Graph("myChart", this.cellsData, this.cellsCol);
    } else {
      this.graphInst.setReqData(this.cellsData, this.cellsCol);
    }
    this.graphInst.drawBarGraph();
  }

  /**
   * Constructing Line Graph based on the selected values
   * @returns {void}
   */
  constructLine() {
    if (!this.graphInst) {
      this.graphInst = new Graph("myChart", this.cellsData, this.cellsCol);
    } else {
      this.graphInst.setReqData(this.cellsData, this.cellsCol);
    }
    this.graphInst.drawLineGraph();
  }

  /**
   * Constructing Pie Chart based on the selected values
   * @returns {void}
   */
  constructPie() {
    if (!this.graphInst) {
      this.graphInst = new Graph("myChart", this.cellsData, this.cellsCol);
    } else {
      this.graphInst.setReqData(this.cellsData, this.cellsCol);
    }
    this.graphInst.drawPieGraph();
  }

  readClipBoardData() {
    navigator.clipboard
      .readText()
      .then((text) => "")
      .catch((err) => console.log(err));
  }

  /**
   * Get selected cells data in a selectedData array
   * @returns {number[]}
   */
  getSelectedData() {
    let selectedData = [];
    for (let i = 0; i < this.selectedCells.length; i++) {
      selectedData.push(this.selectedCells[i][2]);
    }

    return selectedData;
  }
}
