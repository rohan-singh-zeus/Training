function init() {
  var containerHeight = rHeightPrefixSum[rHeightPrefixSum.length - 1];
  var containerWidth = cWidthPrefixSum[cWidthPrefixSum.length - 1];

  var sliderY = document.getElementById("slider-y");
  var trackY = document.getElementById("track-y");
  var sliderPercentageY = null;

  var sliderX = document.getElementById("slider-x");
  var trackX = document.getElementById("track-x");
  var sliderPercentageX = null;

  var getAtInt = function getAtInt(obj, attrib) {
    return parseInt(getComputedStyle(obj, null)[attrib], 10);
  };

  sliderY.addEventListener("mousedown", function (e) {
    mouseDownYOffset =
      e.pageY - getAtInt(trackY, "top") - getAtInt(sliderY, "top");
    document.addEventListener("mousemove", yScroll);
  });


  document.addEventListener("mouseup", function (e) {
    document.removeEventListener("mousemove", yScroll);
    document.removeEventListener("mousemove", xScroll);
  });

  function yScroll(e) {
    sliderY.proposedNewPosY =
      e.pageY - getAtInt(trackY, "top") - mouseDownYOffset;
    if (sliderY.proposedNewPosY < 0) {
      sliderY.style.top = 0;
      shiftTopY = 0;
      shiftBottomY = canvas.height;
      redraw(1);
    } else if (
      sliderY.proposedNewPosY >
      0.8 * (getAtInt(trackY, "height") - getAtInt(sliderY, "height"))
    ) {
      if (getAtInt(sliderY, "height") > 40) {
        sliderY.style.height =
          (canvas.height * canvas.height) / containerHeight + "px";
      }
    //   addRows();
    //   containerHeight = rHeightPrefixSum[rHeightPrefixSum.length - 1];
      sliderY.style.top =
        0.5 * (getAtInt(trackY, "height") - getAtInt(sliderY, "height"));
    } else {
      sliderY.style.top = sliderY.proposedNewPosY + "px";
      sliderPercentageY =
        (sliderY.proposedNewPosY /
          (getAtInt(trackY, "height") - getAtInt(sliderY, "height"))) *
        100;
      shiftTopY = (sliderPercentageY * (containerHeight - canvas.height)) / 100;
      shiftBottomY = shiftTopY + canvas.height;
      redraw(1);
    }
  }



  function redraw(flag) {
    topIndex = cellYIndex(shiftTopY);
    bottomIndex = cellYIndex(shiftBottomY);
    leftIndex = cellXIndex(shiftLeftX);
    rightIndex = cellXIndex(shiftRightX);



    // main cells
    mainCtx.reset(0, 0, canvas.width, canvas.height);
    for (let i = topIndex - 1; i < bottomIndex; i++) {
      for (let j = leftIndex - 1; j < rightIndex; j++) {
        cells[i][j].yVal = rHeightPrefixSum[i] - shiftTopY + 0.5;
        cells[i][j].xVal = cWidthPrefixSum[j] - shiftLeftX + 0.5;
        cells[i][j].createCell();
      }
    }
  }



      // side cells
      cell = new cellStruct(
        1,
        1,
        width,
        height,
        `${currentRowLength + i - 1}`,
        false,
        0,
        sideCtx
      );
      sideCells.push(cell);
    }
//   }


  function getColumnName(num) {
    var s = "",
      t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = ((num - t) / 26) | 0;
    }
    return s || undefined;
  }
// }

window.addEventListener("load", init);


/**
   * @returns {void} --> drawing of grid
   */
drawGrid() {
  this.ctx.strokeStyle = "black";
  this.ctx.lineWidth = 0.2;

  let x = 0;
  for (let j = 0; j <= this.COLS; j++) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, this.canvas.height);
    this.ctx.stroke();

    if (j < this.COLS) x += this.columnWidths[j];
  }

  let y = 0;
  for (let i = 0; i <= this.ROWS; i++) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.COLS * 100, y);
    this.ctx.stroke();
    if (i < this.ROWS) y += this.rowHeights[i];
  }
}
/**
 * @param {boolean[]} filteredData
 * @returns {void}
 */
drawCellContents(filteredData) {
  this.ctx.font = "14px Arial";
  this.ctx.textAlign = "left";
  this.ctx.textBaseline = "middle";
  this.ctx.fillStyle = "#000";

  let y = 0;
  for (let i = 0; i < this.ROWS; i++) {
    if (filteredData[i]) {
      let x = 0;
      for (let j = 0; j < this.COLS; j++) {
        if (this.data[i] && this.data[i][j] !== undefined) {
          this.ctx.fillText(this.data[i][j], x + 5, y + this.CELL_HEIGHT / 2);
        }
        x += this.columnWidths[j];
      }
      y += this.rowHeights[i];
    }
  }
}
/**
 * @param {boolean[]} filteredData
 * @returns {void}
 */
render(filteredData = this.data.map(() => true)) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.fixedRow();
  this.drawFixedCol();
  this.drawGrid();
}
handleFileUplaod(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  console.log(reader);
  reader.onload = (e) => {
    const contents = e.target.result;
    const rows = contents.split("\n").map((row) => row.split(","));
    this.ROWS = rows.length;
    this.COLS = rows[0].length;
    this.data = rows;
    this.columnWidths = Array(this.COLS).fill(100);
    this.render();
  };
  reader.readAsText(file);
}