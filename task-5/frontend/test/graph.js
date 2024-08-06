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

    // /**
    //  * Flag for destroying the graph
    //  * @type {any}
    //  */
    this.draw = null
  }

  destroyGraph(){
    if(this.draw){
        this.draw.destroy()
        this.draw = null
    }
  }

  setReqData(cellsData, cellsCol){
    this.cellsData = cellsData
    this.cellsCol = cellsCol
  }

  /**
   * Drawing Bar Graph
   * @returns {void}
   */
  drawBarGraph() {
    this.destroyGraph()
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
    this.destroyGraph()
    this.draw = new Chart(this.ctx, {
      type : 'line',
      data : {
        labels : this.cellsCol,
        datasets : [
            {
              data : this.cellsData,
              label : "",
              borderColor : "#3cba9f",
              fill : false
            }]
      },
      options : {
        title : {
          display : true,
          // text : 'Chart JS Line Chart Example'
        }
      }
    });
  }

  /**
   * Drawing Pie Chart
   * @returns {void}
   */
  drawPieGraph(){
    this.destroyGraph()
    this.draw=new Chart(this.ctx, {
      type : 'pie',
      data : {
        labels : this.cellsCol,
        datasets : [ {
          // backgroundColor : [ "#51EAEA", "#FCDDB0",
          //     "#FF9D76", "#FB3569", "#82CD47" ],
          data : this.cellsData
        } ]
      },
      options : {
        title : {
          display : true,
          // text : 'Chart JS Pie Chart Example'
        }
      }
    });
  }
}
