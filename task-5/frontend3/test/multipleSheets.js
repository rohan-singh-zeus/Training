import { Excel } from "./excel.js";
import { NotificationToast } from "./notification.js";
import { Sheet } from "./sheet.js";

export class MultipleSheets {
  constructor() {
    MultipleSheets.instance = this;
    /**
     * @type {Excel}
     */
    this.excel = Excel.getInstance();
    this.sheets = this.excel.sheets
    this.activeCurrentIdx = this.excel.activeCurrentIdx

    this.init()
  }

  init() {
    this.addSheet();
    const buttons = document.querySelector(".buttons");
    buttons.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("sheetBtn")) {
        this.switchSheet(parseInt(ev.target.dataset.index) + 1);
      } else if (ev.target.classList.contains("sheetCancel")) {
        this.removeSheet(parseInt(ev.target.dataset.index) + 1);
      }
    });
    this.extendSheetsBtn();
  }

  updateContentArea() {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";
    console.log(this.sheets[this.activeCurrentIdx - 1]);
    const activeSheet = this.sheets[this.activeCurrentIdx - 1].instance;
    grid.appendChild(activeSheet.excel);
  }

  switchSheet(index) {
    if (
      //   index !== this.activeCurrentIdx - 1 &&
      index >= 0 &&
      index <= this.sheets.length
    ) {
      console.log("Inside index");

      this.activeCurrentIdx = index;
      this.updateContentArea();
      this.extendSheetsBtn();
    }
  }

  addSheet() {
    const addSheetBtn = document.getElementById("addSheetBtn");
    addSheetBtn.addEventListener("click", (ev) => {
      this.sheets.push({
        name: `Sheet${this.sheets.length + 1}`,
        instance: new Sheet(this.sheets.length),
      });
      this.switchSheet(this.sheets.length);
      this.extendSheetsBtn();
      console.log(ev.target.dataset.index);
    });
  }

  extendSheetsBtn() {
    const buttons = document.querySelector(".buttons");
    if (this.sheets && this.sheets.length > 0) {
      buttons.innerHTML = this.sheets
        .map(
          (sheet, index) => `
          <div class="sheetWidgets ${index === this.activeCurrentIdx-1 ? "active" : ""}">
            <button class="sheetBtn" data-index="${index}">${sheet.name}</button>
            <button class="sheetCancel" data-index="${index}">X</button>
          </div>
            `
        )
        .join("");
    } else {
      buttons.innerHTML = `<p>No sheets available</p>`;
    }
  }

  removeSheet(index) {
    if (this.sheets.length <= 1) {
      new NotificationToast("You cannot remove the last sheet", 900, 10, "red", "error")
      return;
    }    
    // Remove the sheet from the array
    this.sheets.splice(index-1, 1);

    // Update the active sheet index if needed
    if (index-1 === this.activeCurrentIdx) {
      // Switch to the previous sheet or the first sheet if the last one is removed
      this.activeCurrentIdx = Math.max(0, index - 2);
    } else if (index-1 < this.activeCurrentIdx) {
      // Adjust activeSheetIndex if the removed sheet was before the currently active one
      this.activeCurrentIdx--;
    }

    this.updateContentArea();
    this.extendSheetsBtn()
  }


  static getInstance() {
    if (!MultipleSheets.instance) {
      MultipleSheets.instance = new MultipleSheets();
    }
    return MultipleSheets.instance;
  }
}
