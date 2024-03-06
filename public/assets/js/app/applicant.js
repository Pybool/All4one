const applicationFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "homeTelephone",
  "nin",
  "address",
  "permanentAddress",
  "dob",
  "british_passport",
  "passport_showing_right_to_live",
  "non_eu_passport",
  "certificate_of_registration",
  "eec_passport",
  "other_doc",
  "ukdrivingLicence",
  "hasWorkVehicle",
  "message",
  "bookedHolidays",
  "workHours",
  "likeToWorkLocation",
  "recommendedBy",
  "outstandingAllegations",
  "unspentConvictions",
  "pendingDisciplinaryAction",
  "workHoursConsent",
  "dbsAccurateDocs",
  "dbsAuthorizedApplication",
  "dbsReadPrivacyPolicy",
  "dbsConsentElectronicResult",
  "school1",
  "school1Qualification",
  "school2",
  "school2Qualification",
  "workplace1EmployerName",
  "workPlace1Position",
  "workPlace1RateOfPay",
  "workPlace1DateOfEmployment",
  "workPlace1Duties",
  "workPlace1ReasonLeft",
  "workPlace1ManagersName",
  "workPlace1ManagersPhone",
  "workPlace1ManagersEmail",
  "workplace2EmployerName",
  "workPlace2Position",
  "workPlace2RateOfPay",
  "workPlace2DateOfEmployment",
  "workPlace2Duties",
  "workPlace2ReasonLeft",
  "workPlace2ManagersName",
  "workPlace2ManagersPhone",
  "workPlace2ManagersEmail",
  "workplace3EmployerName",
  "workPlace3Position",
  "workPlace3RateOfPay",
  "workPlace3DateOfEmployment",
  "workPlace3Duties",
  "workPlace3ReasonLeft",
  "workPlace3ManagersName",
  "workPlace3ManagersPhone",
  "workPlace3ManagersEmail",
  "lengthOfGap",
  "workGapBetween",
  "workGapReason",
  "guarantorName",
  "guarantorPhone",
  "guarantorEmail",
  "howDoUKnowGuarantor",
  "guarantor2Name",
  "guarantor2Phone",
  "guarantor2Email",
  "howDoUKnowGuarantor2",
  "nokName",
  "nokAddress",
  "nokPhone",
  "nokRelationship",
  "signatoryDate",
];

let fileInputLabel ;
let fileInput;

try {
  fileInputLabel = document.getElementById("fileInputLabel");
  fileInput = document.getElementById("signature");
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      fileInputLabel.textContent = fileInput.files[0].name;
    } else {
      fileInputLabel.textContent = "Select an image";
    }
  });
} catch {}

function getQueryParamValue(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

(async function () {
  const getQueryParamValue = function (paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  };

  const applicationId = getQueryParamValue("applicationId");
  if (applicationId !== null && applicationId.trim() !== "") {
    await getVacancyApplication(applicationId);
  }
})();

function getFormValues() {
  var values = {};
  var fieldNames = applicationFields;

  try {
    for (var i = 0; i < fieldNames.length; i++) {
      var fieldName = fieldNames[i];
      var fieldElement = document.getElementsByName(fieldName)[0];

      // For radio buttons, check if it is checked
      if (
        fieldElement &&
        (fieldElement.type === "radio" || fieldElement.type === "checkbox")
      ) {
        values[fieldName] = fieldElement.checked;
      } else if (fieldElement) {
        // For other input types, simply get the value
        values[fieldName] = fieldElement.value;
      }
    }
  } catch {
    return values;
  }
  return values;
}

$(".returnApplicantBtn").click(async function (e) {
  const applicantId = document.getElementById("applicantIdInput")?.value;
  await getVacancyApplication(applicantId);
});

async function sendSignature(applicantId) {
  // Get the file input element
  var fileInput = document.querySelector('input[name="signature"]');

  // Check if a file has been selected
  if (fileInput.files.length > 0) {
    // Get the selected file
    var file = fileInput.files[0];

    // Check if the file is an image
    if (file.type.startsWith("image/")) {
      // Check if the file size is less than 5MB
      if (file.size <= 5 * 1024 * 1024) {
        // Create a new FormData object
        var formData = new FormData();

        // Append the file to the FormData object
        formData.append("signature", file);

        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Define the backend URL
        var url = `/api/v1/append-signature?applicationId=${applicantId}`;

        // Open a POST request to the backend URL
        xhr.open("POST", url, true);

        // Set the onload event handler
        xhr.onload = function () {
          // Check if the request was successful
          if (xhr.status >= 200 && xhr.status < 300) {
            // Request was successful, handle response here
            console.log("File uploaded successfully");
          } else {
            // Request failed, handle error here
            console.error("File upload failed");
          }
        };

        // Send the FormData object to the backend
        xhr.send(formData);
      } else {
        // File size exceeds 5MB, display an error message
        alert("File size exceeds 5MB. Please select a smaller file.");
      }
    } else {
      // Selected file is not an image, display an error message
      alert("Selected file is not an image. Please select an image file.");
    }
  }
}

async function getVacancyApplication(_applicantId) {
  const applicantId = _applicantId;
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
      const newUrl = `${window.location.origin}${window.location.pathname}?applicationId=${applicantId}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
      Object.keys(responseData?.data).forEach((key) => {
        if (responseData?.data[key] != null && key !== "signature") {
          try {
            if (
              responseData?.data[key] != true &&
              responseData?.data[key] != false
            ) {
              document.getElementsByName(key)[0].value =
                responseData?.data[key];
            }
            if (responseData?.data[key] == true) {
              console.log(document.getElementsByName(key)[0]);
              document.getElementsByName(key)[0].checked =
                responseData?.data[key];
            }
            if (responseData?.data[key] == false) {
              if (document.getElementsByName(key)[1]?.type === "radio") {
                document.getElementsByName(key)[1].checked = true;
              } else {
                document.getElementsByName(key)[1].checked =
                  responseData?.data[key];
              }
            }
          } catch {}
        }
        if (key === "signature") {
          const signatureUrl = responseData?.data[key];
          fileInputLabel.textContent = "";
          const textContent =
            "Last Signature: " +
              signatureUrl
                ?.substring(signatureUrl.lastIndexOf("/") + 1)
                .replace("Select an image", "") || "Invalid file";
          fileInputLabel.outerHTML = `<p id="fileInputLabel" class="text-left"><a target="_blank" style="color:orange;" href="${signatureUrl}">${textContent}</a></p>`;
        }
      });
      return null;
    }
    alert("We could not retrieve your application at this time");
  } catch (error) {
    console.error("Error:", error);
  }
}
document
  .getElementById("applicationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    
    
    let iscomplete = event.submitter?.id || "0";
    let confirmation = false;
    if (iscomplete === "1") {
      const errors = validateApplicationForm(getFormValues());
      if (errors.length > 0) {
        console.log(errors);
        return alert(
          "Please fill up all required fields ,ensure all email addresses are valid and phone numbers are valid, Phone numbers must be in UK format with country code +44 (0) ..."
        );
      }
      const fileInputLabel = document.getElementById("fileInputLabel");
      console.log(!fileInput.files.length > 0, fileInputLabel);
      if (
        !fileInput.files.length > 0 &&
        !fileInputLabel
          .querySelector("a")
          .getAttribute("href")
          .includes("/assets")
      ) {
        return alert("Please select a file");
      }
      confirmation = confirm(
        "Are you sure you want to submit this application? You will not be able to edit it later "
      );
      if (confirmation) {
        iscomplete = true;
      } else {
        iscomplete = false;
        return null;
      }
    }

    fetch(`/api/v1/submit-application?iscomplete=${iscomplete}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set correct content type
      },
      body: JSON.stringify(getFormValues()),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.status === true) {
          Swal.fire({
            type: "success",
            title: "Application!",
            text: "Application was updated sucessfully",
            timer: 1500,
          });
          if (fileInput.files.length > 0) {
            await sendSignature(data?.data?.applicantId);
          }

          if (iscomplete != "0") {
            window.location.reload();
          }
        } else {
          // Handle other cases if needed
          console.log("Error:", data.message);
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
