
export class Dimension {
  /**
   *
   * @param { number } rows
   * @param { number } columns
   * @param { number } width
   * @param { number } height
   */
  constructor() {

    // Prefix sum arrays for efficient range calculations
    /**
     * @type { Array<number> }
     */
    this.cWidthPrefixSum = [0]; // Prefix sum for column widths
    /**
     * @type { Array<number> }
     */
    this.rHeightPrefixSum = [0]; // Prefix sum for row heights

    // Shift properties for scrolling and viewport management
    /**
     * @type { number }
     */
    this.shiftTop = 0; // Top shift for vertical scrolling
    /**
     * @type { number }
     */
    this.shiftBottom; // Bottom shift (calculated later)
    /**
     * @type { number }
     */
    this.shiftLeft = 0; // Left shift for horizontal scrolling
    /**
     * @type { number }
     */
    this.shiftRight; // Right shift (calculated later)

    // Index properties to keep track of visible cells
    /**
     * @type { number }
     */
    this.topIndex; // Index of the top-most visible row
    /**
     * @type { number }
     */
    this.bottomIndex; // Index of the bottom-most visible row
    /**
     * @type { number }
     */
    this.leftIndex; // Index of the left-most visible column
    /**
     * @type { number }
     */
    this.rightIndex; // Index of the right-most visible column
    /**
     * @type { number }
     */
    this.scale = window.devicePixelRatio; // scale ratio for device pixel ratio

    Dimension.instance = this
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

  static getInstance(){
    if(!Dimension.instance){
        Dimension.instance = new Dimension()
    }
    return Dimension.this
  }

}