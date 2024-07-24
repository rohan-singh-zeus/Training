import { Grid } from "./grid.js";

export class GridRow extends Grid {
  constructor(canvasId) {
    super();
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.drawRowGrid();
    });
  }

  drawRowGrid() {
    console.log("drawGridCol called");
    let cellPositionX = 0;
    // let cellPositionY = 0;
    for (let x = 1; cellPositionX <= this.canvas.width; ++x) {
      cellPositionX += this.defCellWidth;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(cellPositionX + 0.5, 0);
      this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
      this.ctx.lineWidth = 0.4;
      this.ctx.strokeStyle = "#ccc";
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(cellPositionX + 0.5, 0);
    this.ctx.lineTo(cellPositionX + 0.5, this.canvas.height);
    this.ctx.lineWidth = 0.4;
    this.ctx.strokeStyle = "#ccc";
    this.ctx.stroke();
    this.ctx.restore();
  }
}
