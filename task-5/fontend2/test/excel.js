import { GridConstants } from "../constant/index.js";
import { GridCol } from "./gridCol.js";
import { GridMain } from "./gridMain.js";
import { GridRow } from "./gridRow.js";
import { VerticalScroll } from "./verticalScroll.js";
import { HorizontalScroll } from "./horizontalScroll.js";

export class Excel {
  constructor() {
    /**
     * Array of widths of each column
     * @type {number[]} 
     */
    this.colWidth = Array(GridConstants.numCols).fill(
      GridConstants.defCellWidth
    );
    /**
     * Array of heights of row
     * @type {number[]} 
     */
    this.rowHeight = Array(GridConstants.numRows).fill(
      GridConstants.defCellHeight
    );
    /**
     * Array of selected cells for selection
     * @type {number[]}  
     */
    this.selectedCells = [];
    /**
     * Start row, col values for the cells which are selected in the format (row, col)
     * @type {number[]}  
     */
    this.startCell = null;
    /**
     * Current row, col values for the cells to be selected in the format (row, col)
     * @type {number[]}  
     */
    this.currentCell = null;
    this.isSelected = false;
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
     * Starting position of the column where we want to resize from
     * @type {number} 
     */
    this.startX = 0;
    /**
     * Current col selected for resizing
     * @type {number} 
     */
    this.resizeColIndex = -1;
    /**
     * Keeps track if any column is resized or not
     * @type {number[]}
     */
    this.posX = Array(GridConstants.numCols).fill(0);
    this.rowSelected = Array(GridConstants.numCols).fill(false);
    this.varY = 0

    this.init();
  }

  /**
   * Initializing whole Canvas
   * @returns {void}
   */
  init() {
    const gMain = new GridMain(
      "gridMain",
      this.posX,
      this.colWidth,
      this.rowHeight,
      this.selectedCells,
      this.startCell,
      this.currentCell,
      this.isSelected,
      this.isDragging,
      this.isResizing,
      this.startX,
      this.resizeColIndex, this.varY, this.rowSelected
    );
    
    new GridRow(
      "gridRow",
      gMain,
      this.posX,
      this.colWidth,
      this.rowHeight,
      this.selectedCells,
      this.startCell,
      this.currentCell,
      this.isSelected,
      this.isDragging,
      this.isResizing,
      this.startX,
      this.resizeColIndex,
      this.rowSelected
    );

    new GridCol("gridCol")

    new VerticalScroll("verticalScroll", gMain, this.varY);
    new HorizontalScroll("horizontalScroll", gMain);
  }
}
