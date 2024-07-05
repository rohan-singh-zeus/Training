// const canvas = document.getElementById("spreadsheet");
// const ctx = canvas.getContext("2d");
// // ctx.lineWidth = 10;/
// const WIDTH = 80;
// const HEIGHT = 30;
// const NROWS = 100;
// const NCOLS = 100;
// const grids = [];

// class CellStructure {
//   constructor(xVal, yVal, isSelected, ctx, color) {
//     this.xVal = xVal;
//     this.yVal = yVal;
//     this.isSelected = isSelected;
//     this.ctx = ctx;
//     this.color = color;
//   }

//   createCell() {
//     this.ctx.lineWidth = "0.5";
//     this.ctx.strokeStyle = this.color;
//     this.ctx.strokeRect(this.xVal, this.yVal, WIDTH, HEIGHT);
//   }
// }

// for (let i = 0; i < NROWS; i++) {
//   for (let j = 0; j < NCOLS; j++) {
//     const cell = new CellStructure(
//       0 + j * WIDTH,
//       0 + i * HEIGHT,
//       false,
//       ctx,
//       "green"
//     ).createCell();
//     grids.push(cell);
//   }
// }

// function getMousePos(canvas, evt) {
//   var rect = canvas.getBoundingClientRect(),
//     scaleX = canvas.width / rect.width,
//     scaleY = canvas.height / rect.height;

//   return {
//     x: (evt.clientX - rect.left) * scaleX,
//     y: (evt.clientY - rect.top) * scaleY,
//   };
// }

// let start = {};

// function startRect(e) {
//   start = getMousePos(canvas, e);
// }

// window.addEventListener("mousedown", startRect);

// function endRect(e) {
//   let { x, y } = getMousePos(canvas, e);
//   ctx.fillRect(start.x, start.y, x - start.x, y - start.y);
// }

// window.addEventListener("mouseup", endRect);

// canvas.addEventListener("click", (d) => {
// //   const inp = document.querySelector(".excelInp");
// //   inp.style.display = "inline";
// //   const clickX = d.clientX - canvas.getBoundingClientRect().left;
// //   const clickY = d.clientY - canvas.getBoundingClientRect().top;
// //   const selectedRect = grids.find(
// //     (rect) =>
// //       clickX >= rect.xVal &&
// //       clickX < rect.xVal + WIDTH &&
// //       clickY >= rect.yVal &&
// //       clickY < rect.yVal + HEIGHT
// //   );
// //   if (selectedRect) {
// //     // alert(`Clicked on rectangle at row ${clickedRect.row + 1}, col ${clickedRect.col + 1}, x: ${clickedRect.x}, y: ${clickedRect.y}`);
// //     console.log(selectedRect);
// //   }
// console.log(grids);
// });

const canvas = document.getElementById("spreadsheet");
const ctx = canvas.getContext("2d");
const rows = 30;
const cols = 30;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;
const grid = [];

// Draw the grid
function drawGrid() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rect = {
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
        row: row,
        col: col,
      };
      grid.push(rect);
      ctx.strokeStyle = "black";
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
}

// Handle the click event
canvas.addEventListener("click", function (event) {
  const clickX = event.clientX - canvas.getBoundingClientRect().left;
  const clickY = event.clientY - canvas.getBoundingClientRect().top;

  // Find the clicked rectangle
  const clickedRect = grid.find(
    (rect) =>
      clickX >= rect.x &&
      clickX < rect.x + rect.width &&
      clickY >= rect.y &&
      clickY < rect.y + rect.height
  );

  if (clickedRect) {
    // alert(
    //   `Clicked on rectangle at row ${clickedRect.row + 1}, col ${
    //     clickedRect.col + 1
    //   }, x: ${clickedRect.x}, y: ${clickedRect.y}`
    // );

    const inp = document.querySelector(".excelInp");
    inp.value = ""
    inp.style.display = "inline";
    inp.style.position = "absolute";
    inp.style.left = clickedRect.x + 5 + "px";
    inp.style.top = clickedRect.y + 5 + "px";
    inp.style.height = clickedRect.height - 10 + "px"
    inp.style.width = clickedRect.width - 10 + "px"
    
    inp.focus()
  }
});

// Initial draw
drawGrid();


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

let start = {};

function startRect(e) {
  start = getMousePos(canvas, e);
}

window.addEventListener("mousedown", startRect);

function endRect(e) {
  let { x, y } = getMousePos(canvas, e);
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.fillRect(start.x, start.y, x - start.x, y - start.y);
}

window.addEventListener("mouseup", endRect);
