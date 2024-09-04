const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const defaultCellWidth = 100;
const cellHeight = 30;
const numRows = 100;
const numCols = 1000;
let columnWidths = Array(numCols).fill(defaultCellWidth);
let rowHeights = Array(numRows).fill(cellHeight);
let gridData = Array.from({ length: numRows }, () => Array(numCols).fill(""));
let gridCols = [];
let gridRows = [];

let selectedCells = [];
let isDragging = false;
let isResizing = false;
let resizeColIndex = -1;
let startX = 0;
let startCell = null;
let currentCell = null;

let sum = 0;
let min = 0;
let max = 0;
let avg = 0;
let count = 0;

const excel = document.querySelector(".excel");
const ribbon = document.querySelector(".ribbon");
let currentHeight = canvas.height;
let currentWidth = canvas.width;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("dblclick", handleDoubleClick);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndPopulateGrid();
});

excel.addEventListener("scroll", resizeCanvas);

function resizeCanvas() {
  const scrollHeight = excel.scrollHeight;
  const clientHeight = excel.clientHeight;
  const scrollTop = excel.scrollTop;

  const scrollWidth = excel.scrollWidth;
  const clientWidth = excel.clientWidth;
  const scrollLeft = excel.scrollLeft;

  // Increase the canvas height if scrolling reaches near the bottom
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    // 50px before the bottom
    currentHeight += 100; // Increase height by 100px (or any desired amount)
    canvas.height = currentHeight;
    drawGrid(); // Redraw the content if needed
  }
  if (scrollLeft + clientWidth >= scrollWidth - 50) {
    currentWidth += 100;
    canvas.width = currentWidth;
    drawGrid();
  }
}

function fetchDataAndPopulateGrid() {
  // fetch("https://your-backend-api.com/data")
  fetch("test.json")
    .then((response) => response.json())
    .then((data) => {
      gridData.length = 0; // Clear existing data
      Object.keys(data[0]).forEach((d, i) => {
        gridCols.push(d);
      });
      // console.log(gridCols);
      data.forEach((row, rowIndex) => {
        gridData[rowIndex] = Object.values(row);
        gridRows.push(rowIndex);
      });
      // console.log(gridRows);
      drawGrid();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function drawFirstCol() {
  for (let row = 0; row < numRows; row++) {
    // let x = columnWidths[0];
    for (let col = 0; col < 1; col++) {
      const width = columnWidths[col];
      const y = row * cellHeight;
      ctx.fillStyle = "#F5F5F5";
      ctx.fillRect(0, y, width, cellHeight);
      ctx.strokeStyle = "#b6b6b6";
      ctx.strokeRect(0, y, width, cellHeight);
      ctx.fillStyle = "#000000";
      ctx.font = "11px Arial";
      // ctx.textAlign = 'center'
      // ctx.textBaseline = 'middle'
      if (gridRows[row]) {
        ctx.fillText(gridRows[row], 50, y + 20);
      } else {
        ctx.fillText("", 50, y + 20);
      }
      // x += width;
    }
  }
}

function drawFirstRow() {
  for (let row = 0; row < 1; row++) {
    let x = columnWidths[0];
    for (let col = 0; col < numCols; col++) {
      const width = columnWidths[col + 1];
      // const y = row * cellHeight;
      ctx.fillStyle = "#F5F5F5";
      ctx.fillRect(x, 0, width, cellHeight);
      ctx.strokeStyle = "#b6b6b6";
      ctx.strokeRect(x, 0, width, cellHeight);
      ctx.fillStyle = "#000000";
      ctx.font = "11px Arial";
      ctx.fontWeight = "bold";
      if (gridCols[col]) {
        ctx.fillText(gridCols[col], x + 5, 20);
      } else {
        ctx.fillText("", x + 5, 20);
      }
      x += width;
    }
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFirstCol();
  drawFirstRow();

  for (let row = 0; row < numRows; row++) {
    // let x = columnWidths[1];
    let x = columnWidths[0];
    for (let col = 0; col < numCols; col++) {
      const width = columnWidths[col + 1];
      // if(row == 0)
      const y = (row + 1) * cellHeight;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, width, cellHeight);
      ctx.strokeStyle = "#dfdfde";
      ctx.strokeRect(x, y, width, cellHeight);
      ctx.fillStyle = "#000000";
      ctx.font = "11px Arial";
      if (gridData[row][col]) {
        ctx.fillText(gridData[row][col], x + 5, y + 20);
      } else {
        ctx.fillText("", x + 5, y + 20);
      }
      x += width;
    }
  }

  selectedCells.forEach(([row, col, data]) => {
    let x = columnWidths.slice(0, col).reduce((acc, val) => acc + val, 0);
    const y = row * cellHeight;
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fillRect(x, y, columnWidths[col], cellHeight);
    ctx.fillStyle = "black";
    // console.log(data);
  });

  if (currentCell) {
    let x = columnWidths
      .slice(0, currentCell[1])
      .reduce((acc, val) => acc + val, 0);
    const y = currentCell[0] * cellHeight;
    ctx.strokeStyle = "green";
    ctx.strokeRect(x, y, columnWidths[currentCell[1]], cellHeight);
    ctx.strokeStyle = "rgba(231,241,236,0.25)";
  }

  // for (let i = 0; i < selectedCells.length; i++) {
  //   console.log(selectedCells[i]);

  // }
}

function handleMouseDown(event) { 1
  const { offsetX, offsetY } = event;
  let col = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < numCols; i++) {
    x += columnWidths[i];
    if (offsetX < x) {
      col = i;
      break;
    }
  }

  // for (let i = 0; i < numRows; i++) {
  //   y += rowHeights[i];
  //   // if (offsetY < y) {
  //   //   col = i;
  //   //   break;
  //   // }
  // }

  // console.log(offsetX, x);

  const row = Math.floor(offsetY / cellHeight);

  if (offsetX > x - 10 && offsetX < x + 10) {
    isResizing = true;
    resizeColIndex = col;
    startX = offsetX;
    canvas.style.cursor = "col-resize";
    // console.log("Yayy");
    // console.log("Col resize");
  }
  // }else if(offsetY > y-10 && offsetY < y+10){
  //   canvas.style.cursor = "row-resize"
  //   console.log("Row resize");
  // } 
  else {
    isDragging = true;
    startCell = [row, col];
    currentCell = [row, col];
    updateSelectedCells(startCell, currentCell);
    drawGrid();
    // console.log("Nayy");
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
  count = 0;
  sum = 0;
  avg = 0;
  min = 6555550;
  max = -6555550;
  if (isDragging) {
    isDragging = false;
    startCell = null;
    currentCell = null;
  }
  if (isResizing) {
    isResizing = false;
    canvas.style.cursor = "default";
  }
  if (selectedCells.length > 0) {
    for (let i = 0; i < selectedCells.length; i++) {
      // const element = array[i];
      // if(selectedCells[i][2] )
      if (typeof selectedCells[i][2] === "number") {
        sum += selectedCells[i][2];
        count += 1;
        min = Math.min(min, selectedCells[i][2]);
        max = Math.max(max, selectedCells[i][2]);
        // console.log(typeof(selectedCells[i][2]));
      } else {
        // sum = 0;
        // count = 0;
        // min = 0;
        // max = 0;
        // count = 0;
        continue
      }
    }
    // console.log(
    //   `Sum: ${sum}, Average: ${sum / count}, Min: ${min}, Max: ${max}`
    // );
    const sumText = document.querySelector(".sum");
    sumText.innerHTML = `Sum: <span>${sum}</span>`;
    const minText = document.querySelector(".min");
    minText.innerHTML = `Min: <span>${min}</span>`;
    const maxText = document.querySelector(".max");
    maxText.innerHTML = `Max: <span>${max}</span>`;
    const avgText = document.querySelector(".avg");
    avgText.innerHTML = `Average: <span>${sum / count}</span>`;
  }
  if (row === 0) {
    updateSelectedCol(col)
    drawGrid()
  }
  if (col === 0) {
    updateSelectedRow(row);
    drawGrid()
  }
}

function updateSelectedCol(col){
  selectedCells = [];
  for (let row = 0; row < numRows; row++) {
    selectedCells.push([row, col, gridData[row][col-1]])
  }
}

function updateSelectedRow(row){
  selectedCells = [];
  for (let col = 0; col < numCols; col++) {
    selectedCells.push([row, col, gridData[row-1][col]])
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
  const value = prompt("Enter new value:", gridData[row - 1][col - 1]);
  if (value !== null) {
    gridData[row - 1][col - 1] = value;
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
      selectedCells.push([row, col, gridData[row - 1][col - 1]]);
    }
  }
}

function handleKeyDown(event) {
  // if (currentCell) {
  //   let [row, col] = currentCell;
  //   switch (event.key) {
  //     case "ArrowUp":
  //       row = row > 0 ? row - 1 : row;
  //       break;
  //     case "ArrowDown":
  //       row = row < numRows - 1 ? row + 1 : row;
  //       break;
  //     case "ArrowLeft":
  //       col = col > 0 ? col - 1 : col;
  //       break;
  //     case "ArrowRight":
  //       col = col < numCols - 1 ? col + 1 : col;
  //       break;
  //     case "Enter":
  //       const value = prompt("Enter new value:", gridData[row][col]);
  //       if (value !== null) {
  //         gridData[row][col] = value;
  //         drawGrid();
  //       }
  //       break;
  //   }
  //   currentCell = [row, col];
  //   updateSelectedCells(currentCell, currentCell);
  //   drawGrid();
  // }
  // console.log(currentCell);
}

const findReplace = document.querySelector(".findReplace");
findReplace.addEventListener("click", handleFindReplace);

function handleFindReplace() {
  const findValue = prompt("Enter the value to find:");
  if (findValue === null) return; // Cancelled

  const replaceValue = prompt("Enter the value to replace it with:");
  if (replaceValue === null) return; // Cancelled

  // Iterate through gridData and replace values
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (gridData[row][col] === findValue) {
        gridData[row][col] = replaceValue;
      }
    }
  }

  // Re-render the grid
  drawGrid();
}

// const upload = document.querySelector("#uploadFile");

// upload.addEventListener("change", () => {
//   const selectedFile = upload.files[0];
//   console.log("Selected file:", selectedFile);
// });

const file = document.querySelector(".file");
const opeartions = document.querySelector(".operations");
const r31 = document.querySelector(".r-31");
const r32 = document.querySelector(".r-32");

file.addEventListener("click", () => {
  r31.style.display = "inline-flex";
  r32.style.display = "none";
});

opeartions.addEventListener("click", () => {
  r31.style.display = "none";
  r32.style.display = "inline-flex";
});

// const ctx = document.getElementById('myChart');

// new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });