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
