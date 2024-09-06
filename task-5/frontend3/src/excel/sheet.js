import { GridConstants } from "../../constant/index.js";
import { GridTest2 } from "./grid-test-2.js";


export class Sheet{
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

    Sheet.instance = this

  }

  /**
   * Initiaizes the whole Excel
   * @returns {void}
   */
  init(){
    this.grid = new GridTest2("gridCanvas");
    
    // new RowGrid("gridCanvas2", grid)
    
  }

  static getInstance() {
    if (!Sheet.instance) {
      Sheet.instance = new Sheet();
    }
    return Sheet.instance;
  }
}


