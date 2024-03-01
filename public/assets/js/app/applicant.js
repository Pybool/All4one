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
  "signature",
  "signatoryDate",
];

function getQueryParamValue(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

(async function() {
  const getQueryParamValue = function(paramName) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(paramName);
  };

  const applicationId = getQueryParamValue('applicationId');
  if (applicationId !== null && applicationId.trim() !== "") {
      // Assuming `applicantId` was a typo and should be `applicationId`
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
  const applicantId =  document.getElementById("applicantIdInput")?.value;
  await getVacancyApplication(applicantId);
});

async function getVacancyApplication(_applicantId) {
  const applicantId = _applicantId
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
        if (responseData?.data[key] != null) {
          try {
            console.log(document.getElementsByName(key));
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
      });
      return console.log(responseData.data);
    }
    alert("We could not receive your message at this time");
  } catch (error) {
    console.error("Error:", error);
  }
}
document
  .getElementById("applicationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    // const formData = new FormData(this);
    // let formDataObject = {};
    // for (const [key, value] of formData) {
    //     formDataObject[`${key}`] = value;
    // }

    // Fetch API to submit the form data
    fetch("/api/v1/submit-application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set correct content type
      },
      body: JSON.stringify(getFormValues()),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true) {
          Swal.fire({
            type: "success",
            title: "Application!",
            text: "Application was updated sucessfully",
            timer: 1500,
          });
        } else {
          // Handle other cases if needed
          console.log("Error:", data.message);
          alert(data.message)
        }
      })
      .catch((error) => console.error("Error:", error));
  });
