import { Grid } from "./grid.js";

export class GridMain extends Grid {
  constructor(canvasId) {
    super();
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove());
    this.canvas.addEventListener("mouseup", this.handleMouseUp());
    document.addEventListener("DOMContentLoaded", () => {
      this.drawMainGrid();
    });
  }

  drawMainGrid() {
    let cellPositionX = 0;
    let cellPositionY = 0;

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

    for (let y = 1; cellPositionY <= this.canvas.width; ++y) {
      cellPositionY += this.defCellHeight;
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

  handleMouseDown(e) {
    const { offsetX, offsetY } = e;
    console.log(offsetX, offsetY);
  }

  handleMouseMove() {}

  handleMouseUp() {}
}
