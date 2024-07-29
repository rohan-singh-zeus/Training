export class canvasGrid {
    constructor(myCanvas, canvasContainer, fixedRow, fixedCol, cellInput) {
      this.canvas = document.getElementById(myCanvas);
      this.ctx = this.canvas.getContext("2d");
      this.mainCanvasContainer = document.getElementById(canvasContainer);
      this.fixedRowCanvas = document.getElementById(fixedRow);
      this.fixedColCanvas = document.getElementById(fixedCol);
      this.ctxFixedRow = this.fixedRowCanvas.getContext("2d");
      this.ctxFixedCol = this.fixedColCanvas.getContext("2d");
      this.cellInput = document.getElementById(cellInput);
      this.innerCanvasContainer = document.querySelector(".innerCanvasContainer");
      this.CELL_HEIGHT = 30;
      this.RESIZE_HANDLE_WIDTH = 5;
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.ROW_HEIGHT = this.CELL_HEIGHT;
   
      this.ROWS = 100;
      this.COLS = 50;
      this.columnWidths = Array(this.COLS).fill(100);
      this.data = Array(this.ROWS)
        .fill()
        .map(() => Array(this.COLS).fill(""));
      this.isResizing = false;
      this.resizingColumn = -1;
      this.COLUMN_WIDTH = this.columnWidths[0];
   
      this.selectedCells = [];
      this.isSelecting = false;
      this.startCell = null;
   
      this.maxValue = document.querySelector(".max-value");
      this.minValue = document.querySelector(".min-value");
      this.avgValue = document.querySelector(".avg-value");
      this.sumValue = document.querySelector(".sum-value");
      this.cntValue = document.querySelector(".cnt-value");
   
      this.currentHeight = this.canvas.height;
      this.currentWidth = this.canvas.width;
      this.currentRows = this.ROWS;
      this.currentCols = this.COLS;
   
      this.init();
    }
    init() {
      document
        .getElementById("fileInput")
        .addEventListener("change", this.handleFileUplaod.bind(this));
      document
        .getElementById("insertRowBtn")
        .addEventListener("click", this.insertRow.bind(this));
      document
        .getElementById("deleteRowBtn")
        .addEventListener("click", this.deleteRow.bind(this));
      document
        .getElementById("updateRowBtn")
        .addEventListener("click", this.updateRow.bind(this));
      document
        .getElementById("searchInput")
        .addEventListener("change", this.handleSearch.bind(this));
      document
        .getElementById("replaceBtn")
        .addEventListener("click", this.handleReplace.bind(this));
   
      this.fixedRowCanvas.addEventListener("click",this.fixedRowCanvasClick.bind(this));
      this.fixedColCanvas.addEventListener("click",this.fixedColCanvasClick.bind(this));
      this.canvas.addEventListener("mousedown", this.mouseDownResize.bind(this));
      this.canvas.addEventListener("mousemove", this.mouseMoveResize.bind(this));
      this.canvas.addEventListener("mouseup", this.mouseUpResize.bind(this));
      this.canvas.addEventListener("dblclick", this.doubleClick.bind(this));
      document.addEventListener("scroll", this.infiniteScroll.bind(this));
    }
    insertRow() {
      const newRow = Array(this.COLS).fill("");
      this.data.push(newRow);
      this.ROWS++;
      this.render();
    }
    deleteRow() {
      if (this.ROWS > 0) {
        this.data.pop();
        this.ROWS--;
        this.render();
      }
    }
    updateRow() {
      const rowIndex = prompt("Enter the row index to update:");
      if (rowIndex !== null && rowIndex >= 0 && rowIndex < this.ROWS) {
        const newRowData = prompt("Enter the new row data, separated by commas:");
        if (newRowData !== null) {
          const newRow = newRowData.split(",");
          if (newRow.length === this.COLS) {
            this.data[rowIndex] = newRow;
            this.render();
          } else {
            alert(`Invalid data. Expected ${this.COLS} columns.`);
          }
        }
      }
    }
    fixedRow() {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctxFixedRow.clearRect(
        0,
        0,
        this.fixedRowCanvas.width,
        this.fixedRowCanvas.height
      );
      let x = 0;
      for (let j = 0; j <= this.COLS; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.CELL_HEIGHT);
        this.ctx.stroke();
        this.ctxFixedRow.fillStyle = "lightgray";
        this.ctxFixedRow.fillRect(x, 0, this.columnWidths[j], this.CELL_HEIGHT);
        this.ctxFixedRow.fillStyle = "black";
        this.ctxFixedRow.fillText(
          String.fromCharCode(65 + j),
          x + 5,
          this.CELL_HEIGHT / 2
        );
        x += this.columnWidths[j];
      }
    }
    drawFixedCol() {
      this.ctxFixedCol.strokeStyle = "black";
      this.ctxFixedCol.lineWidth = 1;
      this.ctxFixedCol.clearRect(
        0,
        0,
        this.fixedColCanvas.width,
        this.fixedColCanvas.height
      );
      let y = 0;
      for (let i = 0; i < this.ROWS; i++) {
        this.ctxFixedCol.beginPath();
        this.ctxFixedCol.moveTo(0, y);
        this.ctxFixedCol.lineTo(this.fixedColCanvas.width, y);
        this.ctxFixedCol.stroke();
        this.ctxFixedCol.fillStyle = "lightgrey";
        this.ctxFixedCol.fillRect(
          0,
          y,
          this.fixedColCanvas.width,
          this.CELL_HEIGHT
        );
        this.ctxFixedCol.fillStyle = "black";
        this.ctxFixedCol.fillText(i + 1, 5, y + this.CELL_HEIGHT / 2);
        y += this.CELL_HEIGHT;
      }
    }
    fixedRowCanvasClick(e) {
      const rect = this.fixedRowCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const col = this.getColumnAtX(x);
      if (col !== -1 && col < this.COLS) {
        this.selectColumn(col);
      }
    }
    selectColumn(col) {
      this.selectedCells = [];
      for (let row = 0; row < this.ROWS; row++) {
        this.selectedCells.push({
          row,
          col,
          dataAtRowAndCol: this.data[row][col],
        });
      }
      this.highlightSelection();
    }
    fixedColCanvasClick(e) {
      const rect = this.fixedColCanvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const row = Math.floor(y / this.CELL_HEIGHT);
   
      if (row !== -1 && row < this.ROWS) {
        this.selectRow(row);
      }
    }
    selectRow(row) {
      this.selectedCells = [];
      for (let col = 0; col < this.COLS; col++) {
        this.selectedCells.push({
          row,
          col,
          dataAtRowAndCol: this.data[row][col],
        });
      }
      this.highlightSelection();
    }
    drawGrid(filteredData) {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 0.5;
   
      let x = 0;
      for (let j = 0; j <= this.COLS; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
   
        if (j < this.COLS) {
          this.ctx.fillStyle = "#f0f0f0";
          this.ctx.fillRect(
            x - this.RESIZE_HANDLE_WIDTH / 2,
            0,
            this.RESIZE_HANDLE_WIDTH,
            this.canvas.height
          );
        }
        if (j < this.COLS) x += this.columnWidths[j];
      }
   
      let y = 0;
      for (let i = 0; i <= this.ROWS; i++) {
        // if (filteredData[i]) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.COLS * 100, y);
        this.ctx.stroke();
        y += this.CELL_HEIGHT;
        // console.log(y);
        // }
      }
    }
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
          y += this.CELL_HEIGHT;
        }
      }
    }
    render(filteredData = this.data.map(() => true)) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.fixedRow();
      this.drawFixedCol();
      this.drawGrid(filteredData);
      this.drawCellContents(filteredData);
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
    getColumnAtX(x) {
      let accumulatedWidth = 0;
      for (let i = 0; i < this.COLS; i++) {
        accumulatedWidth += this.columnWidths[i];
        if (x < accumulatedWidth) return i;
      }
      return -1;
    }
    getColumnLeftPosition(col) {
      let x = 0;
      for (let i = 0; i < col; i++) {
        x += this.columnWidths[i];
      }
      return x;
    }
    mouseDownResize(e) {
      const rect = this.fixedColCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
   
      const col = this.getColumnAtX(x);
   
      if (
        col > 0 &&
        Math.abs(x - this.getColumnLeftPosition(col)) <
          this.RESIZE_HANDLE_WIDTH / 2
      ) {
        this.isResizing = true;
        this.resizingColumn = col - 1;
        this.fixedColCanvas.style.cursor = "col-resize";
      }
   
      this.fixedColCanvas.addEventListener("mouseup", () => {
        return;
      });
   
      //for selection
      const row = Math.floor(y / this.CELL_HEIGHT);
      let dataAtRowAndCol = this.data[row][col];
      this.startCell = { row, col, dataAtRowAndCol };
      this.selectedCells = [this.startCell];
      this.isSelecting = true;
   
      this.highlightSelection();
    }
    mouseMoveResize(e) {
      const rect = this.fixedColCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
   
      if (this.isResizing) {
        const newWidth = x - this.getColumnLeftPosition(this.resizingColumn);
        if (newWidth > 10) {
          this.columnWidths[this.resizingColumn] = newWidth;
          this.render();
        }
      } else {
        const col = this.getColumnAtX(x);
        if (
          col > 0 &&
          Math.abs(x - this.getColumnLeftPosition(col)) <
            this.RESIZE_HANDLE_WIDTH / 2
        ) {
          this.fixedColCanvas.style.cursor = "col-resize";
        } else {
          this.fixedColCanvas.style.cursor = "default";
        }
      }
   
      //for selection
      if (!this.isSelecting) return;
      const y = e.clientY - rect.top;
   
      const col = this.getColumnAtX(x);
      const row = Math.floor(y / this.CELL_HEIGHT);
      let dataAtRowAndCol = this.data[row][col];
      const cell = { row, col, dataAtRowAndCol };
   
      this.selectedCells = this.getSelectedCells(this.startCell, cell);
   
      this.highlightSelection();
    }
    mouseUpResize(e) {
      this.isResizing = false;
      this.resizingColumn = -1;
      this.fixedColCanvas .style.cursor = "default";
   
      //for selection
      this.canvas.removeEventListener("mousemove", this.mouseMoveSelection);
      this.isSelecting = false;
      const dataAtRowAndColArray = this.selectedCells.map(
        (obj) => obj.dataAtRowAndCol
      );
   
      if (dataAtRowAndColArray.length > 0) {
        const minimum = Math.min(...dataAtRowAndColArray);
        const maximum = Math.max(...dataAtRowAndColArray);
        let sum = 0;
        for (let i = 0; i < dataAtRowAndColArray.length; i++) {
          sum += parseFloat(dataAtRowAndColArray[i]);
        }
        const avg = sum / dataAtRowAndColArray.length;
        const count = dataAtRowAndColArray.length;
   
        this.minValue.textContent = `Min: ${minimum}`;
        this.maxValue.textContent = `Max: ${maximum}`;
        this.avgValue.textContent = `Avg: ${avg.toFixed(2)}`;
        this.sumValue.textContent = `Sum: ${sum}`;
        this.cntValue.textContent = `Cell count: ${count}`;
      }
      this.selectedCells = [];
    }
    doubleClick(e) {
      if (!this.isResizing) {
        const rect = this.canvas.getBoundingClientRect();
        const containerRect = this.innerCanvasContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = this.getColumnAtX(x);
        const row = Math.floor(y / this.CELL_HEIGHT);
   
        if (col !== -1 && row < this.ROWS) {
          this.cellInput.style.display = "block";
          this.cellInput.style.left = `${
            rect.left + this.getColumnLeftPosition(col) - containerRect.left
          }px`;
          this.cellInput.style.top = `${
            rect.top + row * this.CELL_HEIGHT - containerRect.top
          }px`;
          this.cellInput.style.width = `${this.columnWidths[col] - 8}px`;
          this.cellInput.style.height = `${this.CELL_HEIGHT - 5}px`;
          this.cellInput.value = this.data[row][col];
          this.cellInput.focus();
   
          this.cellInput.onblur = () => {
            this.data[row][col] = this.cellInput.value;
            this.cellInput.style.display = "none";
            this.render();
          };
        }
      }
    }
    getSelectedCells(start, end) {
      const selected = [];
      const startRow = Math.min(start.row, end.row);
      const endRow = Math.max(start.row, end.row);
      const startCol = Math.min(start.col, end.col);
      const endCol = Math.max(start.col, end.col);
   
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          let dataAtRowAndCol = this.data[row][col];
          selected.push({ row, col, dataAtRowAndCol });
        }
      }
      return selected;
    }
    highlightSelection() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid(this.data.map(() => true));
      this.drawCellContents(this.data.map(() => true));
   
      if (this.selectedCells.length == 1) {
        this.ctx.fillStyle = "white";
        this.selectedCells.forEach((cell) => {
          const x = this.getColumnLeftPosition(cell.col);
          const y = cell.row * this.CELL_HEIGHT;
          this.ctx.fillRect(x, y, this.columnWidths[cell.col], this.CELL_HEIGHT);
        });
      }
   
      this.ctx.fillStyle = "rgb(0, 128, 0, 0.1)";
      this.selectedCells.slice(1).forEach((cell) => {
        const x = this.getColumnLeftPosition(cell.col);
        const y = cell.row * this.CELL_HEIGHT;
        this.ctx.fillRect(x, y, this.columnWidths[cell.col], this.CELL_HEIGHT);
      });
   
      if (this.selectedCells.length > 0) {
        const minRow = Math.min(...this.selectedCells.map((cell) => cell.row));
        const maxRow = Math.max(...this.selectedCells.map((cell) => cell.row));
        const minCol = Math.min(...this.selectedCells.map((cell) => cell.col));
        const maxCol = Math.max(...this.selectedCells.map((cell) => cell.col));
   
        const xStart = this.getColumnLeftPosition(minCol);
        const yStart = minRow * this.CELL_HEIGHT;
        const xEnd =
          this.getColumnLeftPosition(maxCol) + this.columnWidths[maxCol];
        const yEnd = (maxRow + 1) * this.CELL_HEIGHT;
   
        // border
        this.ctx.strokeStyle = "rgba(0, 128, 0, 0.8)";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
      }
   
      this.drawCellContents(this.data.map(() => true));
    }
    handleSearch() {
      let input = document.querySelector("#searchInput").value.toLowerCase();
      let filteredData = this.data.map((row) =>
        row.some((cell) => cell.toString().toLowerCase().includes(input))
      );
      this.render(filteredData);
    }
    handleReplace() {
      let searchInput = document
        .querySelector("#searchInput")
        .value.toLowerCase();
      let replaceInput = document.querySelector("#replaceInput").value;
   
      if (searchInput === "") return;
   
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          if (this.data[i][j].toString().toLowerCase().includes(searchInput)) {
            this.data[i][j] = this.data[i][j]
              .toString()
              .replace(new RegExp(searchInput, "gi"), replaceInput);
          }
        }
      }
      this.handleSearch();
      this.render();
      alert("data replaced successfully!");
    }
    infiniteScroll(e) {
      const scrollHeight = this.canvas.scrollHeight;
      const clientHeight = this.canvas.clientHeight;
      const scrollTop = this.canvas.scrollTop;
   
      // const scrollWidth = document.documentElement.scrollWidth;
      // const clientWidth = document.documentElement.clientWidth;
      // const scrollLeft = document.documentElement.scrollLeft;
   
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // currentHeight += 100;
        // canvas.height = currentHeight;
        // fixedColCanvas.height = currentHeight;
        // currentRows += 30;
        // ROWS = currentRows;
        const newRows = 30;
        const newRowData = Array(newRows)
          .fill()
          .map(() => Array(this.COLS).fill(""));
   
        this.data = this.data.concat(newRowData);
   
        this.currentHeight += newRows * this.CELL_HEIGHT;
        this.canvas.height = this.currentHeight;
        this.fixedColCanvas.height = this.currentHeight;
   
        this.currentRows += newRows;
        this.ROWS = this.currentRows;
        this.render();
        // console.log(scrollWidth);
        // console.log(clientWidth);
        // console.log(scrollLeft);
        //   if(scrollLeft + clientWidth >= scrollWidth - 50){
        //     currentWidth += 500
        //     canvas.width = currentWidth;
        //     fixedRowCanvas.width = currentWidth;
        //     currentCols += 30;
        //     COLS = currentCols;
        //     drawGrid()
        //     fixedRow();
      }
    }
  }
   