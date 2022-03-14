const template = document.querySelector("#template").content;
const boxes = document.querySelector("#boxes");
const counter = document.querySelector("#request-count");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(
    function (registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    },
    function (err) {
      // registration failed :(
      console.log("ServiceWorker registration failed: ", err);
    }
  );

  let clickCount = 0;
  navigator.serviceWorker.addEventListener("message", (e) => {
    clickCount++;
    counter.innerText = clickCount;
    //console.log(clickCount);
  });
}

for (const fileType of ["text/css", "text/html", "application/json"]) {
  // Clone the template for each box
  const box = template.cloneNode(true);

  // Request fake.css, fake.html and fake.json, respectively
  const fileName = "fake." + fileType.split("/")[1];

  box.querySelector("button").textContent = "Fetch " + fileName;

  // Send fetch request on button click
  box.querySelector("button").addEventListener("click", async (event) => {
    try {
      const response = await fetch(fileName, {
        headers: {
          Accept: fileType,
        },
      });

      // Show response headers
      const headersList = event.target.parentNode.querySelector("dl");
      headersList.innerHTML = "";
      for (const [key, value] of response.headers.entries()) {
        headersList.insertAdjacentHTML(
          "beforeend",
          `<dt class="capitalize font-bold">${key}:</dt><dd>${value}</dd>`
        );
      }

      // Show response content
      const content = await response.text();
      event.target.parentNode.querySelector("textarea").value = content.trim();

      // Throw an error if the response is not "ok" (i.e. not 200-299 range)
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }
    } catch (error) {
      // Change button to display error status
      event.target.classList.remove("bg-yellow-800");
      event.target.classList.add("bg-red-700");
      event.target.textContent = error.message;
    }
  });
  boxes.appendChild(box);
}

console.log(self);
