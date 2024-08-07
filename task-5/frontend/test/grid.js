import { GridConstants } from "../constant/index.js";
import { Graph } from "./graph.js";

export class Grid {
  constructor(
    canvasId,
    columnWidths,
    selectedCells,
    isDragging,
    isResizing,
    resizeColIndex,
    startX,
    startCell,
    currentCell,
    cellsData,
    cellsCol
  ) {
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
    this.columnWidths = columnWidths;
    /**
     * Array of heights of row
     * @type {number[]}
     */
    this.rowHeights = Array(this.numRows).fill(this.cellHeight);
    /**
     * Stores the data in 2-D Array
     * @type {string[][]}
     */
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
    this.selectedCells = selectedCells;
    /**
     * Array of selected data for Graph construction
     * @type {number[]}
     */
    this.cellsData = cellsData;
    /**
     * Array of selected data columns for Graph construction
     * @type {number[]}
     */
    this.cellsCol = cellsCol;
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

    
    this.init();
  }

  /**
   * Initializing the whole Excel and all the mouse events related to it
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
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    document.addEventListener(
      "DOMContentLoaded",
      this.fetchDataAndPopulateGrid.bind(this)
    );

    // document
    //   .querySelector(".excel")
    //   .addEventListener("scroll", this.resizeCanvas.bind(this));
  }

  /**
   * Resizing Canvas based on Scroll
   * @returns {void}
   */
  //   resizeCanvas() {
  //     const excel = document.querySelector(".grid");
  //     const scrollHeight = excel.scrollHeight;
  //     const clientHeight = excel.clientHeight;
  //     const scrollTop = excel.scrollTop;

  //     const scrollWidth = excel.scrollWidth;
  //     const clientWidth = excel.clientWidth;
  //     const scrollLeft = excel.scrollLeft;

  //     if (scrollTop + clientHeight >= scrollHeight - 50) {
  //       this.canvas.height += 100;
  //       this.drawGrid();
  //     }
  //     if (scrollLeft + clientWidth >= scrollWidth - 50) {
  //       this.canvas.width += 100;
  //       this.drawGrid();
  //     }
  //   }

  /**
   * Getting data from backend the populating the Grid
   * @returns {void}
   */
  fetchDataAndPopulateGrid() {
    fetch("test.json")
      .then((response) => response.json())
      .then((data) => {
        this.gridData.length = 0;
        Object.keys(data[0]).forEach((d, i) => {
          this.gridCols.push(d);
        });
        data.forEach((row, rowIndex) => {
          this.gridData[rowIndex] = Object.values(row);
          this.gridRows.push(rowIndex);
        });
        this.drawGrid();
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  /**
   * Drawing the First Col
   * @returns {void}
   */
  drawFirstCol() {
    for (let row = 0; row < this.numRows; row++) {
      const width = this.columnWidths[0];
      const y = row * this.cellHeight;
      this.ctx.fillStyle = "#F5F5F5";
      this.ctx.fillRect(0, y, width, this.cellHeight);
      this.ctx.strokeStyle = "#b6b6b6";
      this.ctx.strokeRect(0, y, width, this.cellHeight);
      this.ctx.fillStyle = "#000000";
      this.ctx.font = "11px Arial";
      if (this.gridRows[row]) {
        this.ctx.fillText(this.gridRows[row], 50, y + 20);
      } else {
        this.ctx.fillText("", 50, y + 20);
      }
    }
  }

  /**
   * Drawing the First Row
   * @returns {void}
   */
  drawFirstRow() {
    for (let row = 0; row < 1; row++) {
      let x = this.columnWidths[0];
      for (let col = 0; col < this.numCols; col++) {
        const width = this.columnWidths[col + 1];
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, 0, width, this.cellHeight);
        this.ctx.strokeStyle = "#dfdfde";
        this.ctx.strokeRect(x, 0, width, this.cellHeight);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "11px Arial";
        this.ctx.fontWeight = "bold";
        if (this.gridCols[col]) {
          this.ctx.fillText(this.gridCols[col], x + 5, 20);
        } else {
          this.ctx.fillText("", x + 5, 20);
        }
        x += width;
      }
    }
  }

  /**
   * Drawing the Main Grid
   * @returns {void}
   */
  drawGrid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawFirstCol();
    this.drawFirstRow();

    let rowCount = this.filteredRows ? this.filteredRows.length : this.numRows;

    for (let row = 0; row < rowCount; row++) {
      let x = this.columnWidths[0];
      let actualRow = this.filteredRows ? this.filteredRows[row] : row;
      for (let col = 0; col < this.numCols; col++) {
        const width = this.columnWidths[col + 1];
        const y = (row + 1) * this.cellHeight;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, width, this.cellHeight);
        this.ctx.strokeStyle = "#dfdfde";
        this.ctx.strokeRect(x, y, width, this.cellHeight);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "11px Arial";
        if (this.gridData[row][col]) {
          this.ctx.fillText(this.gridData[actualRow][col], x + 5, y + 20);
        } else {
          this.ctx.fillText("", x + 5, y + 20);
        }
        x += width;
      }
    }

    this.selectedCells.forEach(([row, col, data]) => {
      let x = this.columnWidths
        .slice(0, col)
        .reduce((acc, val) => acc + val, 0);
      const y = row * this.cellHeight;
      this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      this.ctx.fillRect(x, y, this.columnWidths[col], this.cellHeight);
      this.ctx.fillStyle = "black";
    });

    if (this.currentCell) {
      let x = this.columnWidths
        .slice(0, this.currentCell[1])
        .reduce((acc, val) => acc + val, 0);
      const y = this.currentCell[0] * this.cellHeight;
      this.ctx.strokeStyle = "green";
      this.ctx.strokeRect(
        x,
        y,
        this.columnWidths[this.currentCell[1]],
        this.cellHeight
      );
      this.ctx.strokeStyle = "rgba(231,241,236,0.25)";
    }
  }
  /**
   *
   * Handle Double click event
   * @param {PointerEvent} event  -
   * @returns {void}
   */
  handleDoubleClick(event) {
    // console.log(event);
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
    const value = prompt("Enter new value:", this.gridData[row - 1][col - 1]);
    if (value !== null) {
      this.gridData[row - 1][col - 1] = value;
      this.drawGrid();
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
    this.graph.style.display = "none";
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
      //   this.isResizing = true;
      //   this.resizeColIndex = col;
      //   this.startX = offsetX;
      //   this.canvas.style.cursor = "col-resize";
    } else {
      this.isDragging = true;
      this.startCell = [row, col];
      this.currentCell = [row, col];
      this.updateSelectedCells(this.startCell, this.currentCell);
      this.drawGrid();
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
      this.drawGrid();
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
      this.drawGrid();
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
      this.isResizing = false;
      this.canvas.style.cursor = "default";
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
    if (col === 0) {
      this.updateSelectedRow(row);
      this.drawGrid();
    }
    // for (let i = 0; i < this.selectedCells.length; i++) {
    //     console.log(this.selectedCells[i][2]);
    // }
  }

  /**
   * Handle any key press event
   * @param {KeyboardEvent} ev
   */
  handleKeyPress(ev) {
    if (ev.shiftKey) {
      const selectedData = this.getSelectedData();
      this.copyToClipBoard(selectedData);
      console.log(selectedData);
      
    }
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
      this.selectedCells.push([row, col, this.gridData[row - 1][col]]);
    }
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
        this.selectedCells.push([row, col, this.gridData[row - 1][col - 1]]);
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

  /**
   * Copy to clipboard using ClipBoard API
   * @param {string} data 
   */
  copyToClipBoard(data) {
    navigator.clipboard
      .writeText(data)
      .then(() => console.log("Added to clipboard"))
      .catch((err) => console.log("Failed to copy: ", err));
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
