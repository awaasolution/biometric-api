const multer = require('multer');
const path = require('path');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync'); // Assuming catchAsync is a custom utility
const express = require('express')
const router = express.Router()
const faceCompareController = require('../controllers/faceCompareController')


// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {id} = req.params; // Get user ID from the request body
        const uploadPath = path.join(__dirname, `../uploads/data/${id}/verificationPhotos/`);

        // Ensure the directory exists, create it if not
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath); // Define the folder to save the image
    },
    filename: (req, file, cb) => {
        // Use the original name of the file for the filename
        const fileExtension = path.extname(file.originalname);
        const fileName = "referencePhoto" + fileExtension; // Generate unique filename using timestamp
        cb(null, fileName); // Assign the new filename
    },
});

// Create multer upload instance with single file upload for "image" field
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate if the uploaded file is an image
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    },
});


router
    .route('/:id')
    .post(upload.single('image'), faceCompareController.acceptFaceReferencePhoto)


module.exports = router;