import { GridConstants } from "../constant/index.js";
import { Excel } from "./excel.js";
import { GraphUtils } from "./graphUtils.js";
import { GridTest2 } from "./grid-test-2.js";
import { Scroll } from "./scroll.js";

export class Sheet {
  constructor(sheetIdx) {
    this.sheetIdx = sheetIdx;

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

    this.endX = 640

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
    this.maxRows = GridConstants.numRows

    this.init();

    // this.sheetIdx = 1;

    Sheet.instance = this;
  }

  /**
   * Initiaizes the whole Excel
   * @returns {void}
   */
  init() {
    this.createSheetHTML();

    setTimeout(() => {
      this.grid = new GridTest2(this.sheetIdx);

      new Scroll();
      new GraphUtils(this);
    }, 100);

    // new RowGrid("gridCanvas2", grid)
    // this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));

    // this.resizeObserver.observe(this.grid.canvas);
  }

  createSheetHTML() {
    // const grid = document.querySelector(".grid");
    this.excel = document.createElement("div");
    this.excel.className = `excel-${this.sheetIdx}`;
    this.excel.classList.add("excel");

    const gridIds = document.createElement("canvas");
    gridIds.setAttribute("id", `gridIds-${this.sheetIdx}`);
    gridIds.classList.add("gridIds");
    gridIds.height = 640;
    gridIds.width = 50;

    const gridHeader = document.createElement("canvas");
    gridHeader.setAttribute("id", `gridHeader-${this.sheetIdx}`);
    gridHeader.classList.add("gridHeader");
    gridHeader.height = 32;
    gridHeader.width = 1850;

    const gridMain = document.createElement("canvas");
    gridMain.setAttribute("id", `gridMain-${this.sheetIdx}`);
    gridMain.classList.add("gridMain");
    gridMain.height = 640;
    gridMain.width = 1850;

    const cellInput = document.createElement("input");
    cellInput.type = "text";
    cellInput.setAttribute("id", "cellInput");
    cellInput.style.display = "none";
    cellInput.style.position = "absolute";

    const trackY = document.createElement("div");
    trackY.setAttribute("id", "track-y");
    const sliderY = document.createElement("div");
    sliderY.setAttribute("id", "slider-y");
    trackY.appendChild(sliderY);

    const trackX = document.createElement("div");
    trackX.setAttribute("id", "track-x");
    const sliderX = document.createElement("div");
    sliderX.setAttribute("id", "slider-x");
    trackX.appendChild(sliderX);

    this.excel.appendChild(gridHeader);
    this.excel.appendChild(gridIds);
    this.excel.appendChild(gridMain);
    this.excel.appendChild(cellInput);
    this.excel.appendChild(trackY);
    this.excel.appendChild(trackX);

    // grid.appendChild(excel);
    // console.log(this);

    // this.init();
  }

  appenD() {}

  handleResize() {
    this.scallingCanvas();
  }

  scallingCanvas() {
    console.log("resizing");
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
