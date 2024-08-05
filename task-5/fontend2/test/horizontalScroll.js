export class HorizontalScroll {
  constructor(classId, gMain) {
    /**
     * Main scroll div
     * @type {HTMLElement}
     */
    this.scrollBar = document.getElementsByClassName(classId)[0];
    /**
     * Actual movable scrollbar
     * @type {HTMLElement}
     */
    this.bar = document.getElementsByClassName("horizontalScrollBar")[0];
    /**
     * Flag for moving the scrollbar
     * @type {boolean}
     */
    this.isMoving = false;

    this.topVal = 0;
    this.topY = 0;
    /**
     * Starting x position of mouse
     * @type {number}
     */
    this.startmouseX = 0;
    /**
     * Main Grid Canvas
     * @type {GridMain}
     */
    this.gMain = gMain;

    this.init();
  }

  /**
   * Initialize Custom scroll function
   * @returns {void}
   */
  init() {
    this.bar.addEventListener("pointerdown", (e) => {
      this.handleMouseDown(e);
    });

    window.addEventListener("pointermove", (e) => {
      this.handleMouseMove(e);
    });

    window.addEventListener("pointerup", (e) => {
      this.handleMouseUp(e);
    });
  }

  /**
   * Handle Mouse Down Operation
   * @param {PointerEvent} e
   * @return {void}
   */
  handleMouseDown(e) {
    this.startmouseX = e.offsetX;
    this.isMoving = true;
  }

  /**
   * Handle Mouse move operation
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseMove(e) {
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
        this.scrollBar.clientWidth - this.bar.clientWidth - this.bar.offsetLeft;
      //   console.log(btm);
      if (btm < 10) {
        this.bar.style.width = `${Math.max((810 * 810) / 2000, 40)}px`;
        this.startmouseX = e.offsetX;
        this.bar.style.left = "20px";
      }
    }
  }

  /**
   * Handle Pointer up event
   * @param {PointerEvent} event  -
   * @returns {void}
   */
  handleMouseUp(e) {
    this.isMoving = false;
  }
}
