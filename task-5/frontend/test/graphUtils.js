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

    this.init();
  }

  /**
   * Initializes The whole Utility Class
   * @returns {void}
   */
  init() {
    this.addClickListener(this.findReplace, () => this.handleFindReplace());
    this.addClickListener(this.find, () => this.handleFind());

    this.addClickListener(this.file, () => {
      this.setDisplay(this.r31, "inline-flex");
      this.setDisplay(this.r32, "none");
      this.setDisplay(this.r33, "none");
    });

    this.addClickListener(this.opeartions, () => {
      this.setDisplay(this.r31, "none");
      this.setDisplay(this.r32, "inline-flex");
      this.setDisplay(this.r33, "none");
    });

    this.addClickListener(this.oGraph, () => {
      this.setDisplay(this.r31, "none");
      this.setDisplay(this.r32, "none");
      this.setDisplay(this.r33, "inline-flex");
    });

    this.addClickListener(this.barGraph, () => {
      this.setDisplay(this.graph, "inline-block");
      this.grid.constructBar();
    });

    this.addClickListener(this.lineGraph, () => {
      this.setDisplay(this.graph, "inline-block");
      this.grid.constructLine();
    });

    this.addClickListener(this.pieGraph, () => {
      this.setDisplay(this.graph, "inline-block");
      this.grid.constructPie();
    });
  }

  /**
   * Utility function to set display style for elements
   * @param {HTMLElement} element
   * @param {string} displayStyle
   * @returns {void}
   */
  setDisplay(element, displayStyle) {
    element.style.display = displayStyle;
  }

  /**
   * Utility function to get user input with validation
   * @param {string} promptMessage
   * @returns {string | null}
   */
  getUserInput(promptMessage) {
    const input = prompt(promptMessage);
    return input ? input.trim() : null;
  }

  /**
   * Initialize event listeners with a helper function
   * @param {HTMLElement} element
   * @param {Function} handler
   * @returns {void}
   */
  addClickListener(element, handler) {
    element.addEventListener("click", handler);
  }

  /**
   * Handles Find and Replace feature
   * @returns {void}
   */
  handleFindReplace() {
    const findValue = this.getUserInput("Enter the value to find:");
    if (!findValue) return; // Cancelled or empty input

    const replaceValue = this.getUserInput(
      "Enter the value to replace it with:"
    );
    if (replaceValue === null) return; // Cancelled or empty input

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
