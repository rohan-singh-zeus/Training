import { GridConstants } from "../constant/index.js";
import { GraphUtils } from "./graphUtils.js";
import { MultipleSheets } from "./multipleSheets.js";
import { NotificationToast } from "./notification.js";
import { Scroll } from "./scroll.js";
import { Sheet } from "./sheet.js";
import { UploadFunctionality } from "./upload.js";

// Global Variables

export class Excel {
  constructor() {
    /**
     * Array of widths of each column
     * @type {number[]}
     */
    this.columnWidths = Array(GridConstants.numCols).fill(
      GridConstants.defaultCellWidth
    );

    /**
     * Array of selected cells for selection
     * @type {number[]}
     */
    this.selectedCells = [];

    /**
     * Array of selected data for Graph construction
     * @type {number[]}
     */
    this.cellsData = [];

    /**
     * Array of selected data columns for Graph construction
     * @type {number[]}
     */
    this.cellsCol = [];

    /**
     * Flag for if dragging for multiple selection or not
     * @type {boolean}
     */
    this.isDragging = false;

    /**
     * Flag for if resizing a column or not
     * @type {boolean}
     */
    this.isResizing = false;

    /**
     * Current col selected for resizing
     * @type {number}
     */
    this.resizeColIndex = -1;

    /**
     * Starting position of the column where we want to resize from
     * @type {number}
     */
    this.startX = 0;

    /**
     * Start row, col values for the cells to be selected in the format (row, col)
     * @type {number[]}
     */
    this.startCell = null;

    /**
     * Current row, col values for the cells which are selected in the format (row, col)
     * @type {number[]}
     */
    this.currentCell = null;

    Excel.instance = this;

    this.sheetCounter = 0;

    /**
     * @type { Array<number> }
     */
    this.cWidthPrefixSum = [0]; // Prefix sum for column widths
    /**
     * @type { Array<number> }
     */
    this.rHeightPrefixSum = [0]; // Prefix sum for row heights

    this.shiftTopY = 0;
    this.shiftBottomY = 0;
    this.topIndex = 0;
    this.bottomIndex = 0;
    this.activeCurrentIdx = 1;
    // this.sheetIdx = 1;

    this.sheets = [
      {
        name: "Sheet1",
        instance: new Sheet(1),
      },
    ];
    this.updateContentArea();

    this.init();
  }

  /**
   * Initiaizes the whole Excel
   * @returns {void}
   */
  init() {
    new MultipleSheets();
    new UploadFunctionality();

  }

  updateContentArea() {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";
    console.log(this.sheets[this.activeCurrentIdx - 1]);
    const activeSheet = this.sheets[this.activeCurrentIdx - 1].instance;
    grid.appendChild(activeSheet.excel);
  }

  /**
   * Determines the column index for a given X coordinate.
   * Uses prefix sums to find the index efficiently.
   * @param {number} num - X coordinate
   * @returns {number} - Column index
   */
  cellXIndex(num) {
    for (let i = 1; i < this.cWidthPrefixSum.length; i++) {
      if (num >= this.cWidthPrefixSum[i - 1] && num < this.cWidthPrefixSum[i]) {
        return i - 1;
      }
    }
    return this.cWidthPrefixSum.length - 1; // Return last column index if out of range
  }

  /**
   * Determines the row index for a given Y coordinate.
   * Uses prefix sums to find the index efficiently.
   * @param {number} num - Y coordinate
   * @returns {number} - Row index
   */
  cellYIndex(num) {
    for (let i = 1; i < this.rHeightPrefixSum.length; i++) {
      if (
        num >= this.rHeightPrefixSum[i - 1] &&
        num < this.rHeightPrefixSum[i]
      ) {
        return i - 1;
      }
    }
    return this.rHeightPrefixSum.length - 1; // Return last row index if out of range
  }

  static getInstance() {
    if (!Excel.instance) {
      Excel.instance = new Excel();
    }
    return Excel.instance;
  }
}
