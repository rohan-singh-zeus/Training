import { Grid } from "./grid.js";

export class GraphUtils {
  constructor(grid) {
    /**
     * @type {Grid}
     */
    this.grid = grid;

    /**
     * @type {HTMLElement}
     */
    this.findReplace = document.querySelector(".findReplace");
    /**
     * @type {HTMLElement}
     */
    this.find = document.querySelector(".find");
    /**
     * @type {HTMLElement}
     */
    this.file = document.querySelector(".file");
    /**
     * @type {HTMLElement}
     */
    this.opeartions = document.querySelector(".operations");
    /**
     * @type {HTMLElement}
     */
    this.oGraph = document.querySelector(".oGraph");
    /**
     * @type {HTMLElement}
     */
    this.ctx = document.getElementById("myChart");
    /**
     * @type {HTMLElement}
     */
    this.graph = document.querySelector(".graph");
    /**
     * @type {HTMLElement}
     */
    this.barGraph = document.querySelector(".bar");
    /**
     * @type {HTMLElement}
     */
    this.lineGraph = document.querySelector(".line");
    /**
     * @type {HTMLElement}
     */
    this.pieGraph = document.querySelector(".pie");
    /**
     * @type {HTMLElement}
     */
    this.r31 = document.querySelector(".r-31");
    /**
     * @type {HTMLElement}
     */
    this.r32 = document.querySelector(".r-32");
    /**
     * @type {HTMLElement}
     */
    this.r33 = document.querySelector(".r-33");

    

    this.init()
  }

  /**
   * Initializes The whole Utility Class
   * @returns {void}
   */
  init() {
    this.findReplace.addEventListener("click", () => {
      this.handleFindReplace();
    });
    this.find.addEventListener("click", () => {
      this.handleFind();
    });
    this.file.addEventListener("click", () => {
      this.r31.style.display = "inline-flex";
      this.r32.style.display = "none";
      this.r33.style.display = "none";
    });

    this.opeartions.addEventListener("click", () => {
      this.r31.style.display = "none";
      this.r32.style.display = "inline-flex";
      this.r33.style.display = "none";
    });

    this.oGraph.addEventListener("click", () => {
      this.r31.style.display = "none";
      this.r32.style.display = "none";
      this.r33.style.display = "inline-flex";
    });

    this.barGraph.addEventListener("click", () => {
      this.graph.style.display = "inline-block";
      this.grid.constructBar();
    });

    this.lineGraph.addEventListener("click", () => {
      this.graph.style.display = "inline-block";
      this.grid.constructLine();
    });

    this.pieGraph.addEventListener("click", () => {
      this.graph.style.display = "inline-block";
      this.grid.constructPie();
    });
  }

  /**
   * Handles Find and Replace feature
   * @returns {void}
   */
  handleFindReplace() {
    const findValue = prompt("Enter the value to find:");
    if (findValue === null) return; // Cancelled

    const replaceValue = prompt("Enter the value to replace it with:");
    if (replaceValue === null) return; // Cancelled

    // Iterate through gridData and replace values
    for (let row = 0; row < this.grid.numRows; row++) {
      for (let col = 0; col < this.grid.numCols; col++) {
        if (this.grid.gridData[row][col] === findValue) {
          this.grid.gridData[row][col] = replaceValue;
        }
      }
    }

    // Re-render the grid
    this.grid.drawGrid();
  }

  /**
   * Handles Find feature
   * @returns {void}
   */
  handleFind() {
    const findValue = prompt("Enter the value to find:");
    if (findValue === null) return; // Cancelled
    this.grid.filterRows(findValue);
    this.grid.drawGrid();
  }
}
