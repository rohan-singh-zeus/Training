export class VerticalScroll {
  constructor(classId, gMain, totalConatinerHeight) {
    this.scrollBar = document.getElementsByClassName(classId)[0];
    this.bar = document.getElementsByClassName("verticalScrollBar")[0];
    this.isMoving = false;
    this.topVal = 0;
    this.topY = 0;
    this.startmouseX = 0;
    this.gMain = gMain;
    this.totalConatinerHeight = this.gMain.canvas.height * 2;

    this.init();
  }

  init() {
    this.bar.addEventListener("pointerdown", (e) => {
      this.startmouseX = e.pageY;
      this.isMoving = true;
    });

    window.addEventListener("pointermove", (e) => {
      if (this.isMoving) {
        let diff = e.pageY - this.startmouseX;
        this.bar.style.top = `${Math.max(
          0,
          Math.min(
            this.bar.offsetTop + diff,
            this.scrollBar.clientHeight - this.bar.clientHeight
          )
        )}px`;
        if (parseInt(getComputedStyle(this.bar).top.valueOf()) === 0) {
          this.bar.style.height = this.scrollBar.clientHeight / 2 + "px";
          this.totalConatinerHeight = this.gMain.canvas.height * 2;
        }
        let btm =
          this.scrollBar.clientHeight -
          this.bar.clientHeight -
          this.bar.offsetTop;
        if (btm < 10) {
          this.bar.style.height = `${Math.max(
            (this.gMain.canvas.height * this.gMain.canvas.height) /
              this.totalConatinerHeight,
            40
          )}px`;
          this.bar.style.top = "20px";
          this.totalConatinerHeight += this.gMain.canvas.height;
          this.startmouseX = e.pageY;
        }
      }
    });

    window.addEventListener("pointerup", (e) => {
      this.isMoving = false;
    });
  }
}
