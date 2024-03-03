const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "nin",
  "address",
  "dob",
  "workHours",
  "likeToWorkLocation",
  "recommendedBy",
  "school1",
  "school1Qualification",
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
];

const validateApplicationForm = (formData) => {
  let errors = [];
  let trimmedValue;

  for (let field of Object.keys(formData)) {
    if (requiredFields.includes(field)) {
      trimmedValue = formData[field]?.trim().toLowerCase();
      if (requiredFields.includes(field) && !trimmedValue) {
        errors.push(`${field} is required.`);
      }
    }

    if (trimmedValue.includes("email") && !isValidEmail(formData[field])) {
      errors.push(`${field} is invalid.`);
    }

    if (
      trimmedValue.includes("phone") &&
      !isValidUKPhoneNumber(formData[field])
    ) {
      errors.push(`${field} is invalid.`);
    }
  }
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUKPhoneNumber = (phone) => {
  const phoneRegex =
    /^(?:(?:\+44\s?|0)[1-9]\d{1,4}|(\(?(?:0(?:0|11)\)?[\s-]?\(?|\+44\s?\(0\)?[\s-]?)\d{3,4}\)?[\s-]?\d{3,4})[\s-]?\d{4})$/;
  return phoneRegex.test(phone);
};
