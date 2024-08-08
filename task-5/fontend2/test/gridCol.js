// import { Grid } from "./grid.js";

import { GridConstants } from "../constant/index.js";
import { Excel } from "./excel.js";

export class GridCol {
  constructor(canvasId) {
    // super();
    this.canvasId = canvasId;
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");

    /**
     * @type {Excel}
     */
    this.excel = Excel.getInstance()

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.drawFixedCol();
    });
  }

  drawColGrid() {
    // console.log("drawGridCol called");
    // let cellPositionX = 0;
    let cellPositionY = 0;
    for (let y = 0; cellPositionY <= GridConstants.numRows; ++y) {
      cellPositionY += 35;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, cellPositionY + 0.5);
      this.ctx.lineTo(this.canvas.width, cellPositionY + 0.5);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
      this.ctx.fillStyle = "black";
      this.ctx.fillText(
        "Value",
        y + 5,
        0
      );
    }
  }

  drawFixedCol() {
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 0.3;
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    let y = 0;
    for (let i = 0; i < GridConstants.numRows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
      this.ctx.fillStyle = "lightgray";
      this.ctx.fillRect(
        0,
        y,
        this.canvas.width,
        this.excel.rowHeight[i]
      );
      this.ctx.fillStyle = "black";
      this.ctx.fillText(i + 1, 5, y + GridConstants.defCellHeight / 2);
      y += this.excel.rowHeight[i] - this.excel.varY;
    //   y += GridConstants.defCellHeight - this.excel.varY;
    }
  }

  /**
   * Get random column names
   * @param {number} n
   * @returns {string}
   */
  getColName(n) {
    let columnName = "";
    while (n > 0) {
      let remainder = (n - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      n = Math.floor((n - 1) / 26);
    }
    return columnName;
  }
}
