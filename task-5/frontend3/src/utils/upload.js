export class UploadFunctionality {
  constructor() {
    /**
     * @type {HTMLFormElement}
     */
    this.fileUpload = document.getElementById("file-upload");

    /**
     * @type {HTMLElement}
     */
    this.uploadForm = document.getElementById("uploadForm");

    /**
     * @type {HTMLElement}
     */
    this.progressContainer = document.getElementById("progressContainer");

    /**
     * @type {HTMLElement}
     */
    this.progressElement = document.getElementById("uploadProgress");

    /**
     * @type {HTMLElement}
     */
    this.progressPercentage = document.getElementById("progressPercentage");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7210/progressHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect() // Automatically reconnect on failure
      .build();

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSignalRHandlers();
    this.startSignalRConnection();
  }

  /**
   * Setup event listeners
   * @returns {void}
   */
  setupEventListeners() {
    this.uploadForm.addEventListener("submit", (ev) => this.handleFormSubmit(ev));
  }

  /**
   * Handle form submission
   * @param {MouseEvent} ev 
   * @returns {void}
   */
  handleFormSubmit(ev) {
    ev.preventDefault();
    const file = this.fileUpload.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    this.uploadFile(file);
  }

  /**
   * Upload the selected file
   * @param {Blob} file 
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    this.progressContainer.style.display = "flex";
    try {
      const response = await fetch("https://localhost:7210/api/TodoItems/sendToMQInChunks", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("File upload response:", data);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

   /**
    * Setup SignalR event handlers
    * @returns {void}
    */
   setupSignalRHandlers() {
    this.connection.on("ProgressUpdates", (message) => this.handleProgressUpdate(message));
  }

  /**
   * Handle progress updates from SignalR
   * @param {string} message 
   * @returns {void}
   */
  handleProgressUpdate(message) {
    console.log("Notification received:", message);
    const progress = parseInt(message, 10);
    if (isNaN(progress)) {
      console.error("Invalid progress message:", message);
      return;
    }
    this.progressElement.value += progress;
    this.progressPercentage.innerText = `${this.progressElement.value / 2}%`;
    if (this.progressElement.value / 2 === 100) {
      this.progressContainer.style.display = "none";
    }
  }

  /**
   * Start the SignalR connection
   * @returns {void}
   */
  async startSignalRConnection() {
    try {
      console.log("Starting SignalR client");
      await this.connection.start();
      console.log("SignalR connected");
    } catch (err) {
      console.error("SignalR connection error:", err);
      alert("Failed to connect to progress updates. Please try again.");
    }
  }
}
