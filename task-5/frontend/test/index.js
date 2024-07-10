const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const defaultCellWidth = 100;
const cellHeight = 30;
const numRows = 100;
const numCols = 1000;
let columnWidths = Array(numCols).fill(defaultCellWidth);
let gridData = Array.from({ length: numRows }, () => Array(numCols).fill(""));
// console.log(gridData);

let selectedCells = [];
let isDragging = false;
let isResizing = false;
let resizeColIndex = -1;
let startX = 0;
let startCell = null;
let currentCell = null;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("dblclick", handleDoubleClick);
document.addEventListener("keydown", handleKeyDown);

document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndPopulateGrid();
  drawGrid();
});

function fetchDataAndPopulateGrid() {
  // fetch("https://your-backend-api.com/data")
  fetch("test.json")
    .then((response) => response.json())
    .then((data) => {
      // data.map((d)=>{
      //   console.log(d.name);
      // })
      // console.log(data[0]);
      // gridData.length = 0; // Clear existing data
      console.log(Object.keys(data[0]));
      data.forEach((row, rowIndex) => {
        gridData[rowIndex] = Object.values(row);
      });
      drawGrid();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function drawFirstCol() {
  for (let row = 0; row < numRows; row++) {
    // let x = columnWidths[0];
    for (let col = 0; col < numCols; col++) {
      const width = columnWidths[col];
      const y = row * cellHeight;
      ctx.strokeRect(0, y, width, cellHeight);
      // ctx.fillText(gridData[row][col], x + 5, y + 20);
      // x += width;
    }
  }
}

function drawFirstRow() {
  for (let row = 0; row < numRows; row++) {
    let x = columnWidths[0];
    for (let col = 0; col < numCols; col++) {
      const width = columnWidths[col];
      // const y = row * cellHeight;
      ctx.strokeRect(x, 0, width, cellHeight);
      // ctx.fillText(gridData[row][col], x + 5, y + 20);
      x += width;
    }
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawFirstCol()
  // drawFirstRow()

  for (let row = 1; row < numRows; row++) {
    let x = columnWidths[0];
    for (let col = 1; col < numCols; col++) {
      const width = columnWidths[col];
      const y = row * cellHeight;
      ctx.strokeRect(x, y, width, cellHeight);
      ctx.fillText(gridData[row][col], x + 5, y + 20);
      x += width;
    }
  }

  selectedCells.forEach(([row, col]) => {
    let x = columnWidths.slice(0, col).reduce((acc, val) => acc + val, 0);
    const y = row * cellHeight;
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fillRect(x, y, columnWidths[col], cellHeight);
    ctx.fillStyle = "black";
  });

  if (currentCell) {
    let x = columnWidths
      .slice(0, currentCell[1])
      .reduce((acc, val) => acc + val, 0);
    const y = currentCell[0] * cellHeight;
    ctx.strokeStyle = "green";
    ctx.strokeRect(x, y, columnWidths[currentCell[1]], cellHeight);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
  }
}

function handleMouseDown(event) {
  const { offsetX, offsetY } = event;
  let col = 0;
  let x = 0;

  for (let i = 0; i < numCols; i++) {
    x += columnWidths[i];
    if (offsetX < x) {
      col = i;
      break;
    }
  }

  const row = Math.floor(offsetY / cellHeight);

  if (offsetX > x - 5 && offsetX < x + 5) {
    isResizing = true;
    resizeColIndex = col;
    startX = offsetX;
    canvas.style.cursor = "col-resize";
  } else {
    isDragging = true;
    startCell = [row, col];
    currentCell = [row, col];
    updateSelectedCells(startCell, currentCell);
    drawGrid();
  }
}

function handleMouseMove(event) {
  const { offsetX, offsetY } = event;

  if (isResizing) {
    const delta = offsetX - startX;
    columnWidths[resizeColIndex] += delta;
    startX = offsetX;
    drawGrid();
  } else if (isDragging) {
    let col = 0;
    let x = 0;
    for (let i = 0; i < numCols; i++) {
      x += columnWidths[i];
      if (offsetX < x) {
        col = i;
        break;
      }
    }
    const row = Math.floor(offsetY / cellHeight);
    currentCell = [row, col];
    updateSelectedCells(startCell, currentCell);
    drawGrid();
  } else {
    let x = 0;
    for (let i = 0; i < numCols; i++) {
      x += columnWidths[i];
      if (offsetX > x - 5 && offsetX < x + 5) {
        canvas.style.cursor = "col-resize";
        return;
      }
    }
    canvas.style.cursor = "default";
  }
}

function handleMouseUp(event) {
  if (isDragging) {
    isDragging = false;
    startCell = null;
    currentCell = null;
  }
  if (isResizing) {
    isResizing = false;
    canvas.style.cursor = "default";
  }
}

function handleDoubleClick(event) {
  const { offsetX, offsetY } = event;
  let col = 0;
  let x = 0;

  for (let i = 0; i < numCols; i++) {
    x += columnWidths[i];
    if (offsetX < x) {
      col = i;
      break;
    }
  }

  const row = Math.floor(offsetY / cellHeight);
  const value = prompt("Enter new value:", gridData[row][col]);
  if (value !== null) {
    gridData[row][col] = value;
    drawGrid();
  }
}

function updateSelectedCells(start, end) {
  selectedCells = [];
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];
  const colRange = [Math.min(startCol, endCol), Math.max(startCol, endCol)];

  for (let row = rowRange[0]; row <= rowRange[1]; row++) {
    for (let col = colRange[0]; col <= colRange[1]; col++) {
      selectedCells.push([row, col]);
    }
  }
}

function handleKeyDown(event) {
  if (currentCell) {
    let [row, col] = currentCell;

    switch (event.key) {
      case "ArrowUp":
        row = row > 0 ? row - 1 : row;
        break;
      case "ArrowDown":
        row = row < numRows - 1 ? row + 1 : row;
        break;
      case "ArrowLeft":
        col = col > 0 ? col - 1 : col;
        break;
      case "ArrowRight":
        col = col < numCols - 1 ? col + 1 : col;
        break;
      case "Enter":
        const value = prompt("Enter new value:", gridData[row][col]);
        if (value !== null) {
          gridData[row][col] = value;
          drawGrid();
        }
        break;
    }

    currentCell = [row, col];
    updateSelectedCells(currentCell, currentCell);
    drawGrid();
  }
}

const upload = document.querySelector("#uploadFile");

upload.addEventListener("change", () => {
  const selectedFile = upload.files[0];
  console.log("Selected file:", selectedFile);
});
