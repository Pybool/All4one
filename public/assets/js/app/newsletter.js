document
  .getElementById("newsletterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

const subscribeNewsletter = () => {
  const subscriberObj = {
    subscriber: document.getElementById("newsletterInput")?.value,
  };
  const re = /\S+@\S+\.\S+/;
  if (!re.test(subscriberObj.subscriber)) {
    return alert("Please enter a valid email address");
  }

  fetch("/api/v1/subscribe-newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set correct content type
    },
    body: JSON.stringify(subscriberObj),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === true) {
        Swal.fire({
          type: "success",
          title: "Newsletter!",
          text: data.message,
          timer: 1500,
        });
        document.getElementById("newsletterInput").value = ""
      } else {
        // Handle other cases if needed
        console.log("Error:", data?.message);
        Swal.fire({
            type: "error",
            title: "Newsletter!",
            text: data?.message || "We could not subscribe you at this time",
            timer: 1500,
          });
      }
    })
    .catch((error) => console.error("Error:", error));
};
