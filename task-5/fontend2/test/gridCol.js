import { Grid } from "./grid.js";

export class GridCol extends Grid {
  constructor(canvasId) {
    super();
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.drawColGrid()
    });
  }

  drawColGrid() {
    // console.log("drawGridCol called");
    // let cellPositionX = 0;
    let cellPositionY = 0;
    for (let y = 1; cellPositionY <= this.numRows; ++y) {
        cellPositionY += 35
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(0, cellPositionY + 0.5);
        this.ctx.lineTo(this.canvas.width, cellPositionY + 0.5);
        this.ctx.lineWidth = 0.4;
        this.ctx.strokeStyle = "#ccc";
        this.ctx.stroke();
        this.ctx.restore();
      }
  }
}
