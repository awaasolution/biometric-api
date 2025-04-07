
const fs = require('fs');
const path = require('path');
const catchAsync = require('../utils/catchAsync'); // Assuming you have a catchAsync utility
const axios = require('axios')


exports.compareRealTimeWithPython = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Get user ID from request parameters
    const file = req.file; // Get the uploaded file

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine the new filename (always "referencePhoto" with the same extension)
    const fileExtension = path.extname(file.originalname); // Extract original file extension
    const newFileName = `realtimePhoto${fileExtension}`;
    const newFilePath = path.join(file.destination, newFileName); // New file path

    // Rename the file
    fs.renameSync(file.path, newFilePath);

    console.log(id);
    console.log({
        filePath: `/uploads/data/${id}/verificationPhotos/${newFileName}`,
    });


    const directoryPath = path.join(`/home/zlphabet/ucs/api/uploads/data/${id}/verificationPhotos/`);

    // Read the directory and find the files for reference and realtime photos
    const files = fs.readdirSync(directoryPath);

    const referencePhoto = files.find((file) => file.startsWith("referencePhoto"));
    const realtimePhoto = files.find((file) => file.startsWith("realtimePhoto"));

    if (!referencePhoto || !realtimePhoto) {
      return res.status(404).json({ status: "error", message: "Required photos not found" });
    }

    // Construct URLs for the photos
    const referenceUrl = `http://192.168.50.244:4000/uploads/data/${id}/verificationPhotos/${referencePhoto}`;
    const testUrl = `http://192.168.50.244:4000/uploads/data/${id}/verificationPhotos/${realtimePhoto}`;

    // Send request to the Flask server
    const flaskResponse = await axios.post("http://192.168.50.244:5000/compare-faces", {
      referenceUrl,
      testUrl,
    });

    console.log(flaskResponse.data)
    // Send success response with file path
    return res.status(flaskResponse.status).json(flaskResponse.data);
});




exports.acceptFaceReferencePhoto = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Get user ID from request parameters
    const file = req.file; // Get the uploaded file

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine the new filename (always "referencePhoto" with the same extension)
    const fileExtension = path.extname(file.originalname); // Extract original file extension
    const newFileName = `referencePhoto${fileExtension}`;
    const newFilePath = path.join(file.destination, newFileName); // New file path

    // Rename the file
    fs.renameSync(file.path, newFilePath);

    console.log(id);
    console.log({
        filePath: `/uploads/data/${id}/verificationPhotos/${newFileName}`,
    });

    // Send success response with file path
    return res.status(200).json({
        message: 'File uploaded successfully',
        filePath: `/uploads/data/${id}/verificationPhotos/${newFileName}`,
    });
});
