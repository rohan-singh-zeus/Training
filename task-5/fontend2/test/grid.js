export class Grid {
  constructor() {
    this.numRows = 1000;
    this.numCols = 1000;
    this.defCellWidth = 100;
    this.defCellHeight = 30;
    this.colWidth = Array(this.numCols).fill(this.defCellWidth);
    this.rowHeight = Array(this.numRows).fill(this.defCellHeight);
    this.selectedCells = []
    this.startCell = null
    this.currentCell = null
    this.isSelected = false;
    this.isDragging = false;
    this.isResizing = false
    this.startX = 0
    this.resizeColIndex = -1;
  }
}
