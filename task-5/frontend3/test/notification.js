export class NotificationToast {
  constructor(message, x, y, backgroundClr, className) {
    this.message = message;
    this.x = x;
    this.y = y;
    this.backgroundClr = backgroundClr;
    this.className = className;

    this.init();
  }

  init() {
    Toastify({
      text: this.message,
      duration: 800,
      className: this.className,
      offset: {
        x: this.x,
        y: this.y,
      },
      style: {
        background: this.backgroundClr,
      },
    }).showToast();
  }
}
