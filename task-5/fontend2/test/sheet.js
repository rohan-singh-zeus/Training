import { Excel } from "./excel.js";

export class Sheet {
  constructor() {
    this.init();
  }

  init() {
    this.contructCanvasHtml();
    new Excel()
  }

  contructCanvasHtml() {
    const container = document.createElement("div");
    container.className = "container";

    // Canvases
    const gridCol = document.createElement("canvas");
    gridCol.setAttribute("id", "gridCol");
    gridCol.height = 728;
    gridCol.width = 50;

    const main = document.createElement("div");
    main.className = "main";
    const gridRow = document.createElement("canvas");

    gridRow.setAttribute("id", "gridRow");
    gridRow.height = 30;
    gridRow.width = 2000;
    const gridMain = document.createElement("canvas");

    gridMain.setAttribute("id", "gridMain");
    gridMain.height = 728;
    gridMain.width = 2000;
    const inpText = document.createElement("input");
    inpText.type = "text";
    inpText.className = "inpText";
    main.appendChild(gridRow);
    main.appendChild(gridMain);
    main.appendChild(inpText);

    // ScrollBars
    const horizontalScroll = document.createElement("div");
    horizontalScroll.className = "horizontalScroll";
    const horizontalScrollBar = document.createElement("div");
    horizontalScrollBar.className = "horizontalScrollBar";
    horizontalScroll.appendChild(horizontalScrollBar);

    const verticalScroll = document.createElement("div");
    verticalScroll.className = "verticalScroll";
    const verticalScrollBar = document.createElement("div");
    verticalScrollBar.className = "verticalScrollBar";
    verticalScroll.appendChild(verticalScrollBar);

    container.appendChild(gridCol);
    container.appendChild(main);
    container.appendChild(horizontalScroll);
    container.appendChild(verticalScroll);
    document.body.appendChild(container);
  }
}
