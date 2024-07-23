export class Graph {
  constructor(canvasId, cellsData, cellsCol) {
    this.canvasId = canvasId;
    this.cellsData = cellsData;
    this.cellsCol = cellsCol;
    this.ctx = document.getElementById(this.canvasId);

    this.init();
  }

  init() {
    this.ctx.addEventListener("mouseup", this.test.bind(this));
  }

  test() {
    // console.log(this.cellsCol);
    // console.log(this.cellsData);
    // if(Array.from(this.cellsCol).length === Array.from(this.cellsData).length){
    //     console.log("Equal");
    // }else{
    //     console.log("Not Equal");
    // }
  }

  drawBarGraph() {
    new Chart(this.ctx, {
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

  drawLineGraph() {
    new Chart(this.ctx, {
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

  drawPieGraph(){
    new Chart(this.ctx, {
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
