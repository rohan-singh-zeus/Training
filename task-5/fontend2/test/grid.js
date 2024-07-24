export class Grid {
  constructor() {
    this.numRows = 1000;
    this.numCols = 1000;
    this.defCellWidth = 50;
    this.defCellHeight = 30;
    this.colWidth = Array(this.numCols).fill(this.defCellWidth);
    this.rowHeight = Array(this.numRows).fill(this.defCellHeight);
    this.selectedCells = []
  }
}
