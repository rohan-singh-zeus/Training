import { GridConstants } from "../constant/index.js";
import { GraphUtils } from "./graphUtils.js";
import { GridTest2 } from "./grid-test-2.js";
import { UploadFunctionality } from "./upload.js";
// import { GridTest2 } from "./grid-test-2.js";
// import { GridTest } from "./grid-test.js";

// Global Variables

export class Sheet {
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

    this.init();

    Sheet.instance = this;
  }

  /**
   * Initiaizes the whole Excel
   * @returns {void}
   */
  init() {
    this.grid = new GridTest2("gridCanvas");

    new GraphUtils(this);

    new UploadFunctionality(this);

    // new RowGrid("gridCanvas2", grid)
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));

    this.resizeObserver.observe(this.grid.canvas);
  }

  handleResize() {
    this.scallingCanvas();
  }

  scallingCanvas() {
    console.log("resizing")
    // tells the browser how many of the screen's actual pixels should be used to draw a single CSS pixel
    const dpr = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

    //scalling top canvas
    console.log(
      this.grid.columnCanvas.width,
      this.grid.columnCanvas.clientWidth
    );
    console.log(dpr);

    this.grid.columnCanvas.width = Math.floor(
      this.grid.columnCanvas.clientWidth
    );
    this.grid.columnCanvas.height = Math.floor(
      this.grid.columnCanvas.clientHeight
    );
    this.grid.columnCtx.scale(dpr, dpr);
    console.log(
      this.grid.columnCanvas.width,
      this.grid.columnCanvas.clientWidth
    );

    //scalling side canvas
    this.grid.rowCountCanvas.width = Math.floor(
      this.grid.rowCountCanvas.clientWidth
    );
    this.grid.rowCountCanvas.height = Math.floor(
      this.grid.rowCountCanvas.clientHeight
    );
    this.grid.rowCountCtx.scale(dpr, dpr);

    //scalling main canvas
    this.grid.canvas.width = Math.floor(this.grid.canvas.clientWidth);
    this.grid.canvas.height = Math.floor(this.grid.canvas.clientHeight);
    this.grid.ctx.scale(dpr, dpr);

    this.grid.drawGrid();
    this.grid.drawIds();
    this.grid.drawHeaders();
  }

  static getInstance() {
    if (!Sheet.instance) {
      Sheet.instance = new Sheet();
    }
    return Sheet.instance;
  }
}
