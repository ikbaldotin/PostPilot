import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "postpilot",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary returned no result"));
        }
        resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
