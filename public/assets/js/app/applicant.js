$(".returnApplicantBtn").click(async function (e) {
  await getVacancyApplication();
});

async function getVacancyApplication() {
  const applicantId = document.getElementById("applicantIdInput")?.value;
  if (!applicantId || applicantId.trim() == "") {
    return alert("Invalid application id");
  }
  const url = `/api/v1/fetch-application?applicationId=${applicantId}`; // Replace this with your API endpoint URL

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }

    const responseData = await response.json();
    if (responseData?.status) {
      Object.keys(responseData?.data).forEach((key) => {
        if (responseData?.data[key] != null) {
          try {
            console.log(document.getElementsByName(key))
            document.getElementsByName(key)[0].value = responseData?.data[key];
            if(responseData?.data[key]==true || responseData?.data[key]==false){
                document.getElementsByName(key)[0].checked = responseData?.data[key]
            }
          } catch {}
        }
      });
      return console.log(responseData.data);
    }
    alert("We could not receive your message at this time");
  } catch (error) {
    console.error("Error:", error);
  }
}
document.getElementById('applicationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this);
    const formDataObject = {};
    for (const [key, value] of formData) {
        formDataObject[`${key}`] = value;
    }

    // Fetch API to submit the form data
    fetch('/api/v1/submit-application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set correct content type
        },
        body: JSON.stringify(formDataObject )
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === true) {
            Swal.fire({
                type: "success",
                title: "Application!",
                text: "Application was updated sucessfully",
                timer: 1500,
              });
        } else {
            // Handle other cases if needed
            console.log('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
