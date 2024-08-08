import { GridConstants } from "../constant/index.js";
import { Excel } from "./excel.js";
import { GridRow } from "./gridRow.js";

export class GridMain {
  constructor(
    canvasId,
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
    rowSelected,

  ) {
    /**
     * Main Canvas Element
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
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
    /**
     * Flag for starting the marching ants animation
     * @type {boolean}
     */
    this.isAnimated = false;
    /**
     * Offset value for marching ants animation
     * @type {number}
     */
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
    // this.vScroll = new VerticalScroll('verticalScroll', )
    // this.varY = varY;

    this.gridData = Array.from({ length: GridConstants.numRows }, () =>
      Array(GridConstants.numCols).fill("")
    );

    /**
     * Instance of gridRow class
     * @type {GridRow}
     */
    // this.gRow = new GridRow('')

    /**
     * Highlighting main row
     * @type {boolean[]}
     */
    this.rowSelected = rowSelected

    this.thisCell = [0, 0]; // Add this to keep track of the current cell
    this.handleInputSubmitBound = null; // Store the bound function for event removal

    /**
     * @type {Excel}
     */
    this.excel = Excel.getInstance()
    this.init();
    // this.init();
  }

  /**
   * Initializing Row Grid Canvas
   * @returns {void}
   */
  init() {
    this.canvas.addEventListener(
      "pointerdown",
      this.handleMouseDown.bind(this)
    );
    window.addEventListener("pointermove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("pointerup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    document.addEventListener("keydown", (e) => {
      // console.log(this.dashOffset);
      this.handleMarchingAnt(e);
    });
    document.addEventListener("DOMContentLoaded", () => {
      this.fetchData();
      //   this.drawMainGrid();
      //   this.fillCellContents();
      //   this.highlightSelection()
      // this.handleDevicePixelRatio()
    });

    this.lastDrawTime = 0;
    this.mouseMoveTimeout = null;
  }

  fetchData() {
    fetch("test.json")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        // data.forEach((row, i) => {
        //   // console.log(Object.values(row));
        //   // this.gridData
        //   this.gridData[i] = Object.values(row);
        // });
        this.drawMainGrid();
        // this.fillCellContents();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Draw Main Grid Canvas
   * @returns {void}
   */
  drawMainGrid() {
    this.ctx.reset();
    let cellPositionX = 0;
    let cellPositionY = 0;
    // console.log(this.excel.varY);
    
    for (let x = 0; x <= this.canvas.width; ++x) {
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

    for (let y = 0; y <= this.canvas.height; ++y) {
      cellPositionY += this.defCellHeight - this.excel.varY
    //   cellPositionY += this.defCellHeight
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, cellPositionY + 0.5);
      this.ctx.lineTo(this.canvas.width, cellPositionY + 0.5);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
    }
    // this.fillCellContents();
    this.highlightSelection();
  }

  // fillCellContents() {
  //   this.ctx.font = "10px Arial";
  //   this.ctx.textAlign = "left";
  //   this.ctx.textBaseline = "middle";
  //   this.ctx.fillStyle = "black";
  //   this.gridData.forEach((row, rowIndex) => {
  //     row.forEach((cell, colIndex) => {
  //       const x = this.getColumnLeftPosition(colIndex);
  //       const y = rowIndex * this.defCellHeight;
  //       this.ctx.fillText(cell, x + 5, y + this.defCellHeight / 2);
  //     });
  //   });
  // }

  handleDevicePixelRatio() {
    const dpx = window.devicePixelRatio;

    this.canvas.width = Math.floor(this.canvas.width * dpx);
    this.canvas.height = Math.floor(this.canvas.height * dpx);

    this.ctx.scale(dpx, dpx);
  }

  /**
   * Handle Mouse Down Operation
   * @param {PointerEvent} e
   * @return {void}
   */
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
    this.rowSelected[row] = true
    this.fillUpdatedCells(this.startCell, this.currentCell);
    this.highlightSelection();
    this.drawMainGrid();
    // this.fillCellContents();
  }

  /**
   * Handle Mouse move operation
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseMove(e) {
    if (this.isDragging) {
      if (this.mouseMoveTimeout) {
        clearTimeout(this.mouseMoveTimeout);
      }
      this.mouseMoveTimeout = setTimeout(() => {
        const { offsetX, offsetY } = e;
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
        // this.fillCellContents();
      }, 10);
    }
  }

  /**
   * Handle Pointer up event
   * @param {PointerEvent} event  -
   * @returns {void}
   */
  handleMouseUp(e) {
    this.isDragging = false;
    this.drawMainGrid();
    // this.fillCellContents();
    // console.log(this.selectedCells);
  }

  /**
   * Handle Double click Operation
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleDoubleClick(e) {
    const { offsetX, offsetY } = e;
    const inpText = document.querySelector(".inpText");

    let col = 0;
    let row = 0;
    let x = 0;
    let y = 0;

    for (let i = 0; i < this.numCols; i++) {
      x += this.colWidth[i];
      if (x > offsetX) {
        col = i;
        break;
      }
    }

    for (let j = 0; j < this.numRows; j++) {
      y += this.rowHeight[j];
      if (y > offsetY) {
        row = j;
        break;
      }
    }

    this.thisCell = [row, col];

    inpText.value = this.gridData[row][col]; // Populate input with existing data
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

    inpText.focus();

    // Remove existing event listeners
    inpText.removeEventListener("keydown", this.handleInputSubmitBound);
    inpText.removeEventListener("blur", this.handleInputSubmitBound);

    // Bind the new input submission handler with the current context and store the bound function for later removal
    this.handleInputSubmitBound = this.handleInputSubmit.bind(this);
    inpText.addEventListener("keydown", this.handleInputSubmitBound);
    inpText.addEventListener("blur", this.handleInputSubmitBound);

    // console.log(this.gridData[x][y]);

    // this.gridData[x][y]
    // console.log(x, y);
  }

  /**
   * Handling of adding values
   * @param {KeyboardEvent | PointerEvent} e
   * @returns {void}
   */
  handleInputSubmit(e) {
    if (e.key === "Enter" || e.type === "blur") {
      const inpText = document.querySelector(".inpText");
      const [row, col] = this.thisCell;

      // Save input value to grid data
      this.gridData[row][col] = inpText.value;
      this.ctx.font = "10px Arial";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(
        this.gridData[row][col],
        this.colWidth[row] + 5,
        y + this.defCellHeight / 2
      );

      // Hide input box
      inpText.style.display = "none";

      // Remove event listeners to avoid duplicating them
      inpText.removeEventListener("keydown", this.handleInputSubmitBound);
      inpText.removeEventListener("blur", this.handleInputSubmitBound);

      // Redraw the grid to reflect the changes
      this.drawMainGrid();
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
      x += this.colWidth[i];
    }
    return x;
  }

  /**
   * This enables marching animation through recursion
   * @returns {void}
   */
  march() {
    // const now = performance.now();
    // if (now - this.lastDrawTime < 1000 / 60) {
    //   return; // Skip this frame to maintain 60fps
    // }
    this.dashOffset++;
    if (this.dashOffset > 16) {
      this.dashOffset = 0;
    }
    this.drawDottedRect();
    this.wafId = window.requestAnimationFrame(() => {
      this.drawMainGrid();
      // this.fillCellContents();
      this.march();
    });
    // this.lastDrawTime = now;
  }

  /**
   * Handles Marching Ant Animation logic
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  handleMarchingAnt(e) {
    if (e.key === "Control" && this.selectedCells.length > 1) {
      this.isAnimated = true;
      if (this.isAnimated) {
        window.cancelAnimationFrame(this.wafId);
      }
      this.march();
    }
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
   * Highlight the selected cells
   * @return {void}
   */
  highlightSelection() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawMainGrid();
    // this.fillCellContents();
    if (this.selectedCells.length == 1) {
      // console.log("Highlight of len 1 called section called");

      this.ctx.fillStyle = "transparent";
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

  /**
   *
   * Fill selected row, column array for multiple selection
   * @param {number} start
   * @param {number} end
   * @returns {void}
   */
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
