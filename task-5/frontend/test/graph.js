export class Graph {
  constructor(canvasId, cellsData, cellsCol) {
    /**
     * Canvas Id
     * @type {string}
     */
    this.canvasId = canvasId;
    /**
     * Array of selected data for Graph construction
     * @type {number[]}
     */
    this.cellsData = cellsData;
    /**
     * Array of selected data columns for Graph construction
     * @type {number[]}
     */
    this.cellsCol = cellsCol;
    /**
     * @type {HTMLCanvasElement}
     */
    this.ctx = document.getElementById(this.canvasId);

    /**
     * @type {HTMLElement}
     */
    this.graph = document.querySelector(".graph");

    // /**
    //  * Flag for destroying the graph
    //  * @type {Chart}
    //  */
    this.draw = null;

    /**
     * Flag for moving the graph canvas
     * @type {boolean}
     */
    this.isMoving = false;

    this.startMX = 0;
    this.startMY = 0;

    this.init();
  }

  /**
   * Initializing for mouseevents
   * @returns {void}
   */
  init() {
    this.graph.addEventListener("pointerdown", (e) =>
      this.handlePointerEvent(e, "down")
    );
    window.addEventListener("pointermove", (e) =>
      this.handlePointerEvent(e, "move")
    );
    window.addEventListener("pointerup", (e) =>
      this.handlePointerEvent(e, "up")
    );
  }

  /**
   * Consolidated pointer event handler
   * @param {PointerEvent} e
   * @param {string} action
   * @returns {void}
   */
  handlePointerEvent(e, action) {
    if (action === "down") {
      this.isMoving = true;
      this.startMX = e.pageX;
      this.startMY = e.pageY;
    } else if (action === "move" && this.isMoving) {
      const diffX = e.pageX - this.startMX;
      const diffY = e.pageY - this.startMY;
      requestAnimationFrame(() =>
        this.setElementPosition(this.graph, diffY, diffX)
      );
    } else if (action === "up") {
      this.isMoving = false;
    }
  }
  
  /**
   * Destroy the current graph for switching between different graphs
   * @returns {void}
   */
  destroyGraph() {
    if (this.draw) {
      this.draw.destroy();
      this.draw = null;
    }
  }

  /**
   * Sets the column and main data for rerender
   * @param {number[]} cellsData
   * @param {number[]} cellsCol
   * @returns {void}
   */
  setReqData(cellsData, cellsCol) {
    this.cellsData = cellsData;
    this.cellsCol = cellsCol;
  }

  /**
   * Utility function to create a chart
   * @param {string} type
   * @param {number[]} data
   * @param {*} options
   * @returns
   */
  createChart(type, data, options) {
    return new Chart(this.ctx, {
      type: type,
      data: data,
      options: options,
    });
  }

  /**
   * Utility function to set element position
   * @param {HTMLElement} element
   * @param {number} top
   * @param {number} left
   * @returns {void}
   */
  setElementPosition(element, top, left) {
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  }

  /**
   * Drawing Bar Graph
   * @returns {void}
   */
  drawBarGraph() {
    this.destroyGraph();
    this.draw = this.createChart("bar", {
      labels: this.cellsCol,
      datasets: [{
        label: "",
        data: this.cellsData,
        borderWidth: 1,
      }],
    }, {
      scales: {
        y: { beginAtZero: true },
      },
    });
  }

  /**
   * Drawing Line Graph
   * @returns {void}
   */
  drawLineGraph() {
    this.destroyGraph();
    this.draw = this.createChart("line", {
      labels: this.cellsCol,
      datasets: [{
        data: this.cellsData,
        label: "",
        borderColor: "#3cba9f",
        fill: false,
      }],
    }, {
      title: { display: true },
    });
  }

  /**
   * Drawing Pie Chart
   * @returns {void}
   */
  drawPieGraph() {
    this.destroyGraph();
    this.draw = this.createChart("pie", {
      labels: this.cellsCol,
      datasets: [{
        data: this.cellsData,
      }],
    }, {
      title: { display: true },
    });
  }
}
