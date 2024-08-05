import { GridConstants } from "../constant/index.js";
import { GraphUtils } from "./graphUtils.js";
import { Grid } from "./grid.js";
import { RowGrid } from "./rowCanvas.js";

// Global Variables

export class Excel{
  constructor(){
    /**
     * Array of widths of each column
     * @type {number[]}
     */
    this.columnWidths = Array(GridConstants.numCols).fill(GridConstants.defaultCellWidth);

    /**
     * Array of selected cells for selection
     * @type {number[]}
     */
    this.selectedCells = [];

    /**
     * Array of selected data for Graph construction
     * @type {number[]}
     */
    this.cellsData = []

    /**
     * Array of selected data columns for Graph construction
     * @type {number[]}
     */
    this.cellsCol = []

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
    
    this.init()

  }

  /**
   * Initiaizes the whole Excel
   * @returns {void}
   */
  init(){
    const grid = new Grid("gridCanvas", this.columnWidths, this.selectedCells, this.isDragging, this.isResizing, this.resizeColIndex, this.startX, this.startCell, this.currentCell, this.cellsData, this.cellsCol);
    
    new RowGrid("gridCanvas2", this.columnWidths, grid)
    
    new GraphUtils(grid)

  }
}


