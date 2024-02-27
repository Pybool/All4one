const Message = require("../models/messages.model");
const Application = require("../models/application.model");
const sendMail = require("../services/mailservice");
const ejs = require("ejs");

const applicationFormMissableFields = [
  "british_passport",
  "passport_showing_right_to_live",
  "non_eu_passport",
  "certificate_of_registration",
  "eec_passport",
  "other_doc",
  "ukdrivingLicence",
  "hasWorkVehicle",
  "outstandingAllegations",
  "unspentConvictions",
  "pendingDisciplinaryAction",
  "workHoursConsent",
  "dbsAuthorizedApplication",
  "dbsReadPrivacyPolicy",
  "dbsConsentElectronicResult",
];

const sendMessage = async (req, res) => {
  const { name, email, reason, message } = req.body;

  // Create a new Message document using the Message model
  const newMessage = await new Message({
    name,
    email,
    reason,
    message,
    createdAt: new Date(),
  });

  // Save the new message to the database
  await newMessage
    .save()
    .then(async () => {
      const template = await ejs.renderFile("views/pages/contactus_email.ejs", {
        email,
      });
      const mailOptions = {
        from: "info.splitasset@co.ng",
        to: "info@all4onecareservices.co.uk",
        subject: "All4One New message",
        text: `A new contact from All4One ${email} has gotten in touch with you`,
        html: template,
      };
      sendMail(mailOptions)
        .then((response) => {
          console.log("Email sent successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
        });
      res.json({ status: true, message: "Message sent successfully!" });
    })
    .catch((err) => {
      console.error("Error saving message:", err);
      res
        .status(500)
        .json({ error: "An error occurred while saving the message." });
    });
};

const submitApplication = async (req, res) => {
  //   try {

  let response;
  let applicantId;
  let applicationData = req.body;
  console.log("Application data ", typeof applicationData);
  applicantId = req.query.applicantId || null;
  applicationData.applicantId = applicantId;

  //Change 'on' for boolean fields to true
  Object.keys(applicationData).forEach((key) => {
    if (applicationData[key] == "on") {
      applicationData[key] = true;
    }
  });

  //Handle case when checkboxes are not sent by form, default those fields to false
  for (const field of applicationFormMissableFields) {
    if (!applicationData[field]) {
      applicationData[field] = false;
    }
  }
  const options = {
    upsert: true,
    new: true,
    returnOriginal: false,
    runValidators: true,
  };
  if (!applicationData?.email.trim() || applicationData?.email.trim() == "") {
    return res.send({
      status: false,
      message: "You must enter atleast an email address",
    });
  }
  const query = { $or: [{ applicantId }, { email: applicationData?.email }] };
  applicationData.signature = "";
  console.log("File ",req.file, req.files)
  if (req.file) {
    applicationData.signature = `${req.protocol}://${req.get("host")}/${
      req.file.path
    }`;
  }

  let dbApplication = await Application.findOneAndUpdate(
    query,
    { $set: applicationData },
    options
  );
  if (!applicantId) {
    dbApplication.applicantId = `A41-${dbApplication._id.toString()}`;
    dbApplication = await dbApplication.save();
  }
  if (dbApplication._id) {
    response = {
      status: true,
      message: "Application has been updated",
    };
    const mailOptions = {
      from: "info.splitasset@co.ng",
      to: dbApplication.email,
      subject: "Application Form",
      text: `Application with application id ${dbApplication.applicantId} created or modified`,
      html: "",
    };
    sendMail(mailOptions)
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  } else {
    response = {
      status: false,
      message: "Application could not be updated",
    };
  }
  res.send(response);
  //   } catch (error) {
  //     res.send({
  //       status: false,
  //       message: "Something went wrong while submitting application",
  //     });
  //   }
};

const getApplication = async (req, res) => {
  try {
    const applicantId = req.query.applicationId;
    const query = { $or: [{ applicantId }, { email: applicantId }] };
    const dbApplication = await Application.findOne(query);
    if (dbApplication) {
      return res.send({
        status: true,
        data: dbApplication,
        message: "Successful",
      });
    }
    return res.send({ status: false, message: "Unsuccessful" });
  } catch {
    return res.send({ status: false, message: "Something went wrong" });
  }
};

module.exports = { sendMessage, submitApplication, getApplication };
