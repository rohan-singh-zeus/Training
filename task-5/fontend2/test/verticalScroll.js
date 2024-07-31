export class VerticalScroll {
  constructor(classId) {
    this.scrollBar = document.getElementsByClassName(classId)[0];
    this.bar = document.getElementsByClassName("verticalScrollBar")[0];
    this.isMoving = false;
    this.isMoving2 = false;

    this.init();
  }

  init() {
    this.scrollBar.addEventListener("pointerdown", (e) => {
      //   console.log(e.offsetY);
      //   console.log(e.pageY);
      //   console.log(e.clientY);
      if (e.offsetY > Math.floor((this.scrollBar.scrollHeight * 70) / 100)) {
        console.log("scroll reached");
      }
      console.log(e.offsetY);
      console.log();
      // console.log(this.scrollBar.scrollHeight - e.offsetY);
      // console.log(Math.floor((this.scrollBar.scrollHeight * 70) / 100));
      //   console.log(e);
      this.isMoving = true;
      this.isMoving2 = true;
    });

    this.scrollBar.addEventListener("pointermove", (e) => {
      if (
        this.isMoving &&
        e.offsetY > Math.floor((this.scrollBar.scrollHeight * 70) / 100)
      ) {
        this.bar.style.height = "50%";
      }

      if (this.isMoving2) {
        this.bar.style.top += `${e.offsetY}px`;
      }
    });

    this.scrollBar.addEventListener("pointerup", (e) => {
      this.isMoving = false;
      this.isMoving2 = false;
    });
  }
}
