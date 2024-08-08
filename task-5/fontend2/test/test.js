// class A {
//   constructor() {
//     this.C = C.getInstance();
//     this.init();
//   }

//   init() {
//     console.log(this.C.a)
//     this.C.a = 5;
//     console.log(this.C.a)
//   }
// }

// class B {
//   constructor() {
//     this.C = C.getInstance();
//     this.init();
//   }

//   init() {
//     setTimeout(() => {
//         console.log(this.C.a);
//     }, 100);

//   }
// }

// class C {
//   constructor() {
//     this.a = 0;
//     C.instance = this
//     this.init();
//   }

//   init() {
//     new A();
//     new B();
//   }

//   static getInstance(){
//     if(!C.instance){
//         C.instance = new C()
//     }
//     return C.instance
//   }
// }

// // new C()
// new B()

function handlePaste() {
  let lx = Math.min(this.startCellsX, this.endCellsX);
  let ly = Math.min(this.startCellsY, this.endCellsY);
  console.log(this.copyCutData);
  let transfromToMatrixHelper = this.copyCutData.split("\n");
  this.copyCutData = [];
  for (
    let rowIndex = 0;
    rowIndex + 1 < transfromToMatrixHelper.length;
    ++rowIndex
  ) {
    let temp = transfromToMatrixHelper[rowIndex].split("    ");
    this.copyCutData.push(temp);
  }
  // return;
  this.startCellsX = lx;
  this.startCellsY = ly;
  if (this.copyCutData.length)
    this.endCellsY = ly + this.copyCutData.length - 1;
  this.endCellsX = lx;
  if (this.copyCutData[0]) this.endCellsX = lx + this.copyCutData[0].length - 1;

  for (let j = 0; j < this.copyCutData.length; ++j) {
    for (let i = 0; i < this.copyCutData[0].length; ++i) {
      // this.data[j + ly][i + lx] = this.copyCutData[j][i];
      this.setCellValue(j + ly, i + lx, this.copyCutData[j][i]);
    }
  }

  this.drawGrid();
  this.selection = 1;
  this.drawSelection();
  this.selection = 0;
}

function handleCopy() {
  if (this.isCellsCopyCut === 0) return;

  this.copyCutAnimationDiv = document.getElementById("copyCutAnimationDiv");
  // console.log(copyCutAnimationDiv);
  if (!this.copyCutAnimationDiv) {
    this.createCopyCutAnimationDiv();
  }

  let selectionLeftSpace = -this.scrollXaxisValue;
  let selectionTopSpace = -this.scrollYaxisValue;
  let selectionHeight = 0;
  let selectionWidth = 0;

  let lx = Math.min(this.copyCutStartX, this.copyCutEndX);
  let ly = Math.min(this.copyCutStartY, this.copyCutEndY);
  let hx = Math.max(this.copyCutStartX, this.copyCutEndX);
  let hy = Math.max(this.copyCutStartY, this.copyCutEndY);

  // if(
  //     this.copyCutStartX !== lx &&
  //     this.copyCutStartY !== ly &&
  //     this.copyCutEndX !== hx &&
  //     this.copyCutEndY !== hy
  // ){

  // }

  for (let x = 0; x < lx; ++x) {
    selectionLeftSpace += this.columnWidth + (this.topSizeMap[x + 1] || 0);
  }
  for (let y = 0; y < ly; ++y) {
    selectionTopSpace += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
  }

  for (let x = lx; x <= hx; ++x) {
    selectionWidth += this.columnWidth + (this.topSizeMap[x + 1] || 0);
  }
  for (let y = ly; y <= hy; ++y) {
    selectionHeight += this.rowHeight + (this.leftSizeMap[y + 1] || 0);
  }
  this.copyCutAnimationDiv.style.display = `block`;
  this.copyCutAnimationDiv.style.top = `${
    selectionTopSpace + this.canvasTop.height - 1
  }px`;
  this.copyCutAnimationDiv.style.left = `${
    selectionLeftSpace + this.canvasLeft.width - 1
  }px`;
  this.copyCutAnimationDiv.style.width = `${selectionWidth + 2}px`;
  this.copyCutAnimationDiv.style.height = `${selectionHeight + 2}px`;

  const style = document.createElement("style");
  const keyframes = `
        @keyframes border-dance {
        0% {
            background-position: 0px 0px, 100px ${selectionHeight}px, 0px 100px, ${selectionWidth}px 0px;
        }
        100% {
            background-position: 100px 0px, 0px ${selectionHeight}px, 0px 0px, ${selectionWidth}px 100px;
        }
        }`;
  style.textContent = keyframes;
  document.head.appendChild(style);

  let copyToClipboardString = "";
  // this.copyCutData = [];

  for (let j = ly; j <= hy; ++j) {
    // let tempRow = [];
    for (let i = lx; i <= hx; ++i) {
      // tempRow.push(this.data[j][i]);
      copyToClipboardString +=
        (this.getCellValue(j, i) || "") + (i === hx ? "\n" : "   ");
    }
    // this.copyCutData.push(tempRow);
  }

  this.copyToClipboard(copyToClipboardString);
  this.fixedOnFrame.append(this.copyCutAnimationDiv);
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text).then(
    () => {
      // console.log('Text copied to clipboard successfully!');
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
}

async function getClipboardData() {
  await navigator.clipboard.readText().then(
    (text) => {
      // console.log(text);
      this.copyCutData = text;
      // console.log(this.copyCutData);
      this.handlePaste();
    },
    (err) => {
      return "";
    }
  );
}
