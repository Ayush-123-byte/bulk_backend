import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import fs from "fs";

cloudinary.config({
  cloud_name: "dzyf83dzu",
  api_key: "399542719614922",
  api_secret: "qlku--3njYzuBgNcwiKp9FwxFOY",
});
const uploadCloud = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
   const response= await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};



export default uploadCloud;