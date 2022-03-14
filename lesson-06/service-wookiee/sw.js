let userClient;

self.addEventListener("fetch", async (e) => {
  try {
    userClient = await self.clients.get(e.clientId);
    if (userClient) {
      userClient.postMessage("message");
      console.log("inside worker if", userClient);
    }
  } catch (error) {
    console.log("SW error: " + error);
  }
});

self.addEventListener("fetch", (e) => {
  try {
    let url = e.request.url;
    let fileName = url.split("/").pop();
    console.log("File name: " + fileName);

    let response = new Response();

    switch (fileName) {
      case "fake.css":
        response.headers.set("Content-Type", "text/css");
        response.headers.set("Date", new Date().toUTCString());
        e.respondWith(response);
        break;

      case "fake.html":
        response.headers.set("Content-Type", "text/html");
        response.headers.set("Date", new Date().toUTCString());
        e.respondWith(response);
        break;

      case "fake.json":
        response.headers.set("Content-Type", "application/json");
        response.headers.set("Date", new Date().toUTCString());
        e.respondWith(response);
        break;

      default:
        console.log("look at me!");
        break;
    }
  } catch (error) {
    console.log("Error in file check event " + error);
  }
});
