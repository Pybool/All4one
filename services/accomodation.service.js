const Accomodation = require("../models/accomodation.model");
const path = require("path");
const sharp = require("sharp");
const { exec } = require("child_process");

const validatePayload = (payload) => {
  let result = { status: true, message: "Validation passed" };
  console.log(
    "Payload string ",
    payload.name?.trim() === "",
    typeof payload.name != "string"
  );
  if (payload.name?.trim() === "" || typeof payload.name != "string") {
    result.status = false;
    result.message = "Please provide a valid name for this accomodation";
  }

  if (payload.location?.trim() === "" || typeof payload.location != "string") {
    result.status = false;
    result.message = "Please provide a valid location for this accomodation";
  }

  return result;
};

class AccomodationService {
  static async processImages(files, outputDirectory) {
    let resolvedImages = [];
    let sizeBeforeCompression, sizeAfterCompression;

    for (let file of files) {
      const compressedFileName = file.filename.split(".")[0];
      const compressedImageFilePath = path.join(
        outputDirectory,
        `${compressedFileName}.png`
      );

      resolvedImages.push(compressedImageFilePath.split("public")[1]);

      await sharp(file.path)
        .jpeg({ quality: 50 })
        .toFile(compressedImageFilePath)
        .then(() => {
          const sizeBeforeCompressionCommand = `du -h ${file.path}`;
          const sizeAfterCompressionCommand = `du -h ${compressedImageFilePath}`;

          exec(sizeBeforeCompressionCommand, (err, stdout, stderr) => {
            sizeBeforeCompression = stdout.split("\\t")[0];

            exec(sizeAfterCompressionCommand, (err, stdout, stderr) => {
              sizeAfterCompression = stdout.split("\\t")[0];
            });
          });
          return null;
        });
    }
    return { resolvedImages, sizeBeforeCompression, sizeAfterCompression };
  }

  static async createAccomodation(req) {
    const payload = JSON.parse(req.body.data);
    const result = validatePayload(payload);
    if (!result.status) {
      return result;
    }

    try {
      if (!req.files) {
        return { message: "Please upload valid images" };
      }
      const files = req.files;
      const outputDirectory = path
        .join(__dirname, "public", "assets", "compressedImages")
        .replace("services", "");
      const { resolvedImages, sizeBeforeCompression, sizeAfterCompression } =
        await AccomodationService.processImages(files, outputDirectory);
      payload.images = resolvedImages;
      payload.createdAt = new Date();
      await Accomodation.create(payload);
      return {
        status: true,
        message: "New accomodation created successfully",
        sizeBeforeCompression,
        sizeAfterCompression,
      };
    } catch (error) {
      console.log("error ", error);
      return {
        error: error,
      };
    }
  }

  static async getAccomodations() {
    try {
      const accomodations = await Accomodation.find({});
      return {
        status: true,
        data: accomodations,
        code: 200,
      };
    } catch (error) {
      return { message: "Internal server error", code: 500 };
    }
  }

  static async editAccomodationDetails(req) {
    const { accomodationId, ...updateData } = req.body;
    const isValidAccommodationId =
      mongoose.Types.ObjectId.isValid(accomodationId);

    if (!isValidAccommodationId) {
      return { message: "Invalid accommodation ID", code: 400 };
    }

    const accommodation = await Accomodation.findByIdAndUpdate(
      accomodationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!accommodation) {
      return { message: "Accommodation not found", code: 404 };
    }
    return {
      message: "Accomodation updated sucessfully",
      accommodation,
      code: 200,
    };
  }

  static async deleteAccomodation(req) {
    const { accommodationId } = req.body;
    const isValidAccommodationId =
      mongoose.Types.ObjectId.isValid(accommodationId);

    if (!isValidAccommodationId) {
      return { message: "Invalid accommodation ID", code: 400 };
    }

    const accommodation = await Accomodation.findByIdAndDelete(accommodationId);

    if (!accommodation) {
      return { message: "Accommodation not found", code: 404 };
    }

    return { message: "Accommodation deleted successfully", code: 200 };
  }

  static async addAccomodationImage(req) {
    if (!req.files) {
      return { message: "Please upload valid images" };
    }
    const accomodationId = req.query.accomodationId;
    const isValidAccommodationId =
      mongoose.Types.ObjectId.isValid(accomodationId);

    if (!isValidAccommodationId) {
      return { message: "Invalid accommodation ID", code: 400 };
    }

    const { resolvedImages } = await AccomodationService.processImages(
      files,
      outputDirectory
    );

    updateData.images = resolvedImages;
    const updateData = {
      $push: { images: { $each: resolvedImages } },
    };

    const updatedAccommodation = await Accomodation.findByIdAndUpdate(
      accomodationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAccommodation) {
      return { message: "Accommodation update failed", code: 500 };
    }
    return {
      message: "Accomodation updated sucessfully",
      updatedAccommodation,
      code: 200,
    };
  }

  static async deleteAccomodationImage(req) {
    try {
      const { accommodationId, imageUrl } = req.body;

      const isValidAccommodationId =
        mongoose.Types.ObjectId.isValid(accommodationId);
      if (!isValidAccommodationId) {
        return { message: "Invalid accommodation ID", code: 400 };
      }

      if (!imageUrl) {
        return { message: "Missing image URL", code: 400 };
      }

      const accommodation = await Accomodation.findById(accommodationId);

      if (!accommodation) {
        return { message: "Accommodation not found", code: 404 };
      }

      const updatedImages = accommodation.images.filter(
        (image) => image !== imageUrl
      );

      if (updatedImages.length === accommodation.images.length) {
        return { message: "Image URL not found", code: 404 };
      }

      const updateData = { images: updatedImages };
      const updatedAccommodation = await Accomodation.findByIdAndUpdate(
        accommodationId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAccommodation) {
        return { message: "Accommodation update failed", code: 500 };
      }

      return { message: "Image deleted successfully", code: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Internal server error", code: 500 };
    }
  }
}

module.exports = AccomodationService;
