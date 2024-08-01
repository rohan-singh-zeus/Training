export class VerticalScroll {
  constructor(classId) {
    this.scrollBar = document.getElementsByClassName(classId)[0];
    this.bar = document.getElementsByClassName("verticalScrollBar")[0];
    this.isMoving = false;
    this.topVal = 0;
    this.topY = 0;
    this.startmouseX = 0;

    this.init();
  }

  init() {
    this.bar.addEventListener("pointerdown", (e) => {
      this.startmouseX = e.offsetY;
      this.isMoving = true;
    });

    window.addEventListener("pointermove", (e) => {
      if (this.isMoving) {
        let diff = e.offsetY - this.startmouseX;
        this.bar.style.top = `${Math.max(
          0,
          Math.min(
            this.bar.offsetTop + diff,
            this.scrollBar.clientHeight - this.bar.clientHeight
          )
        )}px`;
        let btm =
          this.scrollBar.clientHeight -
          this.bar.clientHeight -
          this.bar.offsetTop;
        console.log(btm);
        if (btm < 10) {
          this.bar.style.height = `${Math.max(
            this.bar.scrollHeight / 2,
            40
          )}px`;
          this.startmouseX = e.offsetY;
          this.bar.style.top = "20px";
        }
      }
    });

    window.addEventListener("pointerup", (e) => {
      this.isMoving = false;
    });
  }
}
