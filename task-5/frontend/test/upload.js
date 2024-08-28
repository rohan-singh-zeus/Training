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

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7210/progressHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

      this.init()
  }

  init() {

    this.uploadForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
    //   const csvUpload = document.getElementById("csvUpload");
      const file = this.fileUpload.files[0];
      if (!file) {
        alert("No file found");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      document.getElementById("progressContainer").style.display = "flex";
      fetch("https://localhost:7210/api/TodoItems/sendToMQInChunks", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    });

    this.connection.on("ProgressUpdates", function (message) {
      console.log("Notification received --> ", message);
      const progressElement = document.getElementById("uploadProgress");
      const progressPercentage = document.getElementById("progressPercentage");
      progressElement.value += message;
      progressPercentage.innerText = `${progressElement.value / 2}%`;
      if(progressElement.value / 2 === 100){
        document.getElementById("progressContainer").style.display = "none";
    
      }
      //   setTimeout(() => {
      //     if (progressElement.value / 2 === 100) {
      //       alert("Upload complete!");
      //     }
      //   }, 2);
    });

    this.start();
  }

  async start() {
    console.log("Starting SignalR client");
    await this.connection.start();
    console.log("SignalR connected");
  }
}
