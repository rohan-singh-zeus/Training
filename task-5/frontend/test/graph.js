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
    this.graph.addEventListener("pointerdown", this.handleMouseDown.bind(this));
    window.addEventListener("pointermove", this.handleMouseMove.bind(this));
    window.addEventListener("pointerup", this.handleMouseUp.bind(this));
  }

  /**
   * Handle mouse down event
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseDown(e) {
    // console.log(e.offsetX, e.offsetY);
    this.isMoving = true;
    // console.log(e.offsetX, e.offsetY);
    this.startMX = e.pageX;
    this.startMY = e.pageY;
  }

  /**
   * Handle mouse move event
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseMove(e) {
    // console.log(e.offsetX);
    if (this.isMoving) {
      const diffX = e.pageX - this.startMX;
      const diffY = e.pageY - this.startMY;
    //   console.log(diffX, diffY);
    this.graph.style.top = `${diffY}px`
    this.graph.style.left = `${diffX}px`
    // console.log(e.offsetX, e.offsetY);
    }
    
  }

  /**
   * Handle mouse up event
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseUp(e) {
    this.isMoving = false;
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
   * Drawing Bar Graph
   * @returns {void}
   */
  drawBarGraph() {
    this.destroyGraph();
    this.draw = new Chart(this.ctx, {
      type: "bar",
      data: {
        // labels: [0,1,3,4],
        labels: this.cellsCol,
        datasets: [
          {
            label: "",
            data: this.cellsData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  /**
   * Drawing Line Graph
   * @returns {void}
   */
  drawLineGraph() {
    this.destroyGraph();
    this.draw = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: this.cellsCol,
        datasets: [
          {
            data: this.cellsData,
            label: "",
            borderColor: "#3cba9f",
            fill: false,
          },
        ],
      },
      options: {
        title: {
          display: true,
          // text : 'Chart JS Line Chart Example'
        },
      },
    });
  }

  /**
   * Drawing Pie Chart
   * @returns {void}
   */
  drawPieGraph() {
    this.destroyGraph();
    this.draw = new Chart(this.ctx, {
      type: "pie",
      data: {
        labels: this.cellsCol,
        datasets: [
          {
            // backgroundColor : [ "#51EAEA", "#FCDDB0",
            //     "#FF9D76", "#FB3569", "#82CD47" ],
            data: this.cellsData,
          },
        ],
      },
      options: {
        title: {
          display: true,
          // text : 'Chart JS Pie Chart Example'
        },
      },
    });
  }
}
