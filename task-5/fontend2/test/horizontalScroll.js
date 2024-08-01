export class HorizontalScroll {
    constructor(classId) {
      this.scrollBar = document.getElementsByClassName(classId)[0];
      this.bar = document.getElementsByClassName("horizontalScrollBar")[0];
      this.isMoving = false;
      this.topVal = 0;
      this.topY = 0;
      this.startmouseX = 0;
  
      this.init();
    }
  
    init() {
      this.bar.addEventListener("pointerdown", (e) => {
        this.startmouseX = e.offsetX;
        this.isMoving = true;
      });
  
      window.addEventListener("pointermove", (e) => {
        if (this.isMoving) {
          let diff = e.offsetX - this.startmouseX;
          this.bar.style.left = `${Math.max(
            0,
            Math.min(
              this.bar.offsetLeft + diff,
              this.scrollBar.clientWidth - this.bar.clientWidth
            )
          )}px`;
          let btm =
            this.scrollBar.clientWidth -
            this.bar.clientWidth -
            this.bar.offsetLeft;
        //   console.log(btm);
          if (btm < 10) {
            this.bar.style.width = `${Math.max(
              this.bar.scrollWidth / 2,
              40
            )}px`;
            this.startmouseX = e.offsetX;
            this.bar.style.left = "20px";
          }
        }
      });
  
      window.addEventListener("pointerup", (e) => {
        this.isMoving = false;
      });
    }
  }
  