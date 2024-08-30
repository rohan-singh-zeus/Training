export class GridFunctionalities {
  constructor() {
    GridFunctionalities.instance = this;
  }

  /**
   * Copy selected cells data to convert into a unique string
   * @param {number[]} initialCell
   * @param {number[]} finalCell
   * @param {string[][]} gridData
   * @returns {string}
   */
  handleCopyToClipBoard(initialCell, finalCell, gridData) {
    let copyToClipboardString = "";
    const [startRow, startCol] = initialCell;
    const [endRow, endCol] = finalCell;
    const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
    const colRange = [Math.min(startCol, endCol), Math.max(startCol, endCol)];
    for (let row = rowRange[0]; row <= rowRange[1]; row++) {
      for (let col = colRange[0]; col <= colRange[1]; col++) {
        copyToClipboardString +=
          (gridData[row - 1][col - 1] || "") +
          (col === colRange[1] ? "-}" : "-->");
      }
    }
    return copyToClipboardString;
  }

  /**
   * Copy to clipboard the unique string using ClipBoard API
   * @param {string} data
   * @returns {void}
   */
  copyToClipBoard(data) {
    navigator.clipboard
      .writeText(data)
      .then(() => console.log("Added to clipboard"))
      .catch((err) => console.log("Failed to copy: ", err));
  }


  handlePasteToGrid(ev){
    
  }

  static getInstance() {
    if (!GridFunctionalities.instance) {
      GridFunctionalities.instance = new GridFunctionalities();
    }
    return GridFunctionalities.instance;
  }
}
