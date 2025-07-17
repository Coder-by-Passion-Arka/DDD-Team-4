import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Function to ensure Cloudinary is configured
const ensureCloudinaryConfig = () => {
  if (!cloudinary.config().cloud_name) {
    console.log("🔧 Configuring Cloudinary with:");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4) : "MISSING");
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4) : "MISSING");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
};

/** 
 * Uploads a file to Cloudinary
 * @param {string} localFilePath - Path to the local file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    // Ensure Cloudinary is configured before using it
    ensureCloudinaryConfig();
    
    if (!localFilePath) return null;

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "peer-evaluation-platform",
      use_filename: true,
      unique_filename: false,
      ...options,
    });

    // File has been uploaded successfully
    console.log("File uploaded on Cloudinary:", response.url);

    // Remove the locally saved temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Remove the locally saved temporary file as the upload operation failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary delete response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary:", response);
    return response;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export default { uploadOnCloudinary, deleteFromCloudinary };