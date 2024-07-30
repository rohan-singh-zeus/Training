import { GridMain } from "./gridMain.js";
import { GridRow } from "./gridRow.js";

const numRows = 1000;
const numCols = 1000;
const defCellWidth = 100;
const defCellHeight = 30;
let colWidth = Array(numCols).fill(defCellWidth);
let rowHeight = Array(numRows).fill(defCellHeight);
let selectedCells = [];
let startCell = null;
let currentCell = null;
let isSelected = false;
let isDragging = false;
let isResizing = false;
let startX = 0;
let resizeColIndex = -1;
let posX = Array(numCols).fill(0);
let rowSelected = Array(numRows).fill(false)

// new GridCol("gridCol")
const gMain = new GridMain("gridMain", posX, numRows, numCols, defCellHeight, defCellWidth, colWidth, rowHeight, selectedCells, startCell, currentCell, isSelected, isDragging, isResizing, startX, resizeColIndex);
new GridRow("gridRow", gMain, posX, numRows, numCols, defCellHeight, defCellWidth, colWidth, rowHeight, selectedCells, startCell, currentCell, isSelected, isDragging, isResizing, startX, resizeColIndex, rowSelected);
