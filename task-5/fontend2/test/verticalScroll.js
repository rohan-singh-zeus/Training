import { GridMain } from "./gridMain.js";

export class VerticalScroll {
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
    this.bar = document.getElementsByClassName("verticalScrollBar")[0];
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
    /**
     * Outer scroll div height
     * @type {number}
     */
    this.totalContainerHeight = this.gMain.canvas.height * 2;

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
    this.startmouseX = e.pageY;
    this.isMoving = true;
  }

  /**
   * Handle Mouse move operation
   * @param {PointerEvent} e
   * @returns {void}
   */
  handleMouseMove(e) {
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
        this.totalContainerHeight = this.gMain.canvas.height * 2;
      }
      let btm =
        this.scrollBar.clientHeight -
        this.bar.clientHeight -
        this.bar.offsetTop;
      if (btm < 10) {
        this.bar.style.height = `${Math.max(
          (this.gMain.canvas.height * this.gMain.canvas.height) /
            this.totalContainerHeight,
          40
        )}px`;
        this.bar.style.top = "20px";
        this.totalContainerHeight += this.gMain.canvas.height;
        this.startmouseX = e.pageY;
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
