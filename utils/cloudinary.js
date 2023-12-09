// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dzyf83dzu",
  api_key: "399542719614922",
  api_secret: "qlku--3njYzuBgNcwiKp9FwxFOY",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudinary", response.url);
    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // removing the locally saved temp file as the upload operation got faied
    fs.unlinkSync(localFilePath);
    return null;
  }
};

// export { uploadOnCloudinary };
module.exports=uploadOnCloudinary;
