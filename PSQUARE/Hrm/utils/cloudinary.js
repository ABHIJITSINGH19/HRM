import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const mimetype = file && file.mimetype ? file.mimetype : "";
    const fileType = mimetype.split("/")[0] || "image";
    const extension = (mimetype.split("/")[1] || "jpg").toLowerCase();

    return {
      folder: "HRM-Project",
      resource_type: "auto",
      format: extension,
      use_filename: true,
      unique_filename: true,
      transformation:
        fileType === "image"
          ? [
              { width: 1000, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ]
          : undefined,
    };
  },
});

export { cloudinary, storage };
