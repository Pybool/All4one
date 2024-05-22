const Message = require("../models/messages.model");
const Application = require("../models/careers.model");
const Newsletter = require("../models/newsletter.model");
const sendMail = require("../services/mailservice");
const generateUniqueCode = require("./helper").generateUniqueCode;
const validateApplicationForm = require("./helper").validateApplicationForm;
const ejs = require("ejs");
const juice = require("juice");

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
      const template = await ejs.renderFile(
        "views/pages/emailtemplates/contactus_email.ejs",
        {
          email,
          name: newMessage?.name,
          message: newMessage?.message,
        }
      );
      const mailOptions = {
        from: "INFO@ALL4ONECARESERVICES.CO.UK".toLowerCase(),
        to: "INFO@ALL4ONECARESERVICES.CO.UK".toLowerCase(),
        subject: "Contact Us",
        text: `A new contact from All4One ${email} has gotten in touch with you`,
        html: juice(template),
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
  try {
    let response;
    let applicantId;
    let applicationData = req.body;
    if (req.query.iscomplete === "1") {
      let errors = validateApplicationForm(applicationData);
      if (errors.length > 0) {
        console.log("Form errors ", errors);
        return res.send({
          status: false,
          message:
            "Please fill up all required fields ,ensure all email addresses are valid and phone numbers are valid, Phone numbers must be in UK format with country code +44 (0) ...",
        });
      }
    }
    let exists = await Application.findOneAndUpdate({
      email: applicationData.email,
    });
    if (exists && exists?.isComplete) {
      return res.send({
        status: false,
        message:
          "This application is now read-only, you cannot edit this application anymore",
      });
    }
    if (req.query.iscomplete == "true" || req.query.iscomplete == "1") {
      applicationData.isComplete = true;
    }
    delete applicationData.signature;
    console.log(applicationData);
    applicantId = req.query.applicantId || null;

    Object.keys(applicationData).forEach((key) => {
      if (applicationData[key] == "on") {
        applicationData[key] = true;
      }
    });

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
    let dbApplication = await Application.findOneAndUpdate(
      query,
      { $set: applicationData },
      options
    );

    if (!dbApplication.applicantId) {
      dbApplication.applicantId = generateUniqueCode("A41");
      dbApplication = await dbApplication.save();
    }
    delete dbApplication.signature;
    if (dbApplication._id) {
      response = {
        status: true,
        data: dbApplication,
        message: "Application has been updated",
      };
      let emailOrName = dbApplication?.firstName;
      if (emailOrName?.trim() == "") {
        emailOrName = applicationData?.email;
      }
      const template = await ejs.renderFile(
        "views/pages/emailtemplates/applicationsuccess_email.ejs",
        {
          emailOrName,
        }
      );
      const mailOptions = {
        from: "INFO@ALL4ONECARESERVICES.CO.UK".toLowerCase(),
        to: dbApplication.email,
        subject: "All4One career Application Form",
        text: `Application with application id ${dbApplication.applicantId} created or modified`,
        html: juice(template),
      };
      if (applicationData.isComplete) {
        sendMail(mailOptions)
          .then((response) => {
            console.log("Email sent successfully:", response);
          })
          .catch((error) => {
            console.error("Failed to send email:", error);
          });
      }
    } else {
      response = {
        status: false,
        message: "Application could not be updated",
      };
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "Something went wrong while submitting application",
    });
  }
};

const getApplication = async (req, res) => {
  try {
    const applicantId = req.query?.applicationId;
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
  } catch (error) {
    return res.send({ status: false, message: "Something went wrong" });
  }
};

const subscribeNewsLetter = async (req, res) => {
  try {
    const subscriber = req.body.subscriber;
    const re = /\S+@\S+\.\S+/;
    if (!re.test(subscriber)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address",
      });
    }
    let dbApplication = await Application.findOne({ email: subscriber });
    let emailOrName = dbApplication?.firstName || null;
    if (emailOrName?.trim() === "" || emailOrName === null ) {
      emailOrName = subscriber;
    }
    const exists = await Newsletter.findOne({ email: subscriber });
    if (exists !== null) {
      return res.status(200).json({
        status: true,
        message: "You are already subscribed to our newsletter, Thank you.",
      });
    }
    const subscription = await Newsletter.create({
      email: subscriber,
      createdAt: new Date(),
    });
    if (subscription._id.toString()) {
      const template = await ejs.renderFile(
        "views/pages/emailtemplates/newsletter_email.ejs",
        {
          emailOrName,
        }
      );

      const mailOptions = {
        from: "INFO@ALL4ONECARESERVICES.CO.UK".toLowerCase(),
        to: subscriber,
        subject: "Newsletter Subscription",
        text: `Thank you for subscribing to our newsletter`,
        html: juice(template),
      };

      sendMail(mailOptions)
        .then((response) => {
          console.log("Email sent successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
        });
      return res.status(200).json({
        status: true,
        message: "Thank you for subscribing to our newsletter",
      });
    }
    return res.status(400).json({
      status: false,
      message: "Unfortunately we could not subscribe you at this time",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Something is not quite right",
    });
  }
};

const appendApplicationSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        status: false,
        message: "No signature file was appended",
      });
    }
    if (!req.file.mimetype.includes("image")) {
      return res.send({
        status: false,
        message: "Uploaded file is not a valid image",
      });
    }
    const applicantId = req.query.applicationId.trim();
    let dbApplication = await Application.findOne({ applicantId });
    if (!dbApplication) {
      return res.send({ status: false, message: "Signature upload failed" });
    }
    dbApplication.signature =
      "/" + req.file.path.replace(/\\/g, "/").replace("public/", "");
    await dbApplication.save();
    res.send({
      status: true,
      imageUrl: dbApplication.signature,
      message: "Signature has been appended to application",
    });
  } catch {
    return res.send({
      status: false,
      message: "Could not append signature to application",
    });
  }
};

module.exports = {
  sendMessage,
  submitApplication,
  getApplication,
  subscribeNewsLetter,
  appendApplicationSignature,
};
