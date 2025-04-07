const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require("./../utils/AppError")
const jwt = require('jsonwebtoken')
const { generateToken } = require('../utils/jwtUtil')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    console.log(req.body.rollNumber)
    // Set the dynamic folder path for image uploads
    // const userFolder = path.join(__dirname, '../uploads/data', req.body.rollNumber, 'images'); // Dynamic folder path
    const userFolder = path.join(`${__dirname}/../uploads/data/${req.body.rollNumber}/images`)
    console.log(userFolder)

    // Ensure the directory exists; if not, create it
    fs.mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder); // Destination folder
  },
  filename: (req, file, cb) => {
    // Set the filename to the original name of the file
    cb(null, file.originalname);
  }
});

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Validate file type (optional: accept only images)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Please upload a valid image file', 400), false);
    }
    cb(null, true);
  }
}).single('profileImg'); // 'profileImg' corresponds to the field name in your form




exports.adminLogin = catchAsync(
    async (req, res, next)=>{
        const {name, password} = req.body;
      const user = await User.findOne(
          {
            name,
            role: {$eq: 'admin'}
          }
      ).select('+password')

        if(!user) return next(new AppError("Admin not found", 404));
        const isCorrectPassword = await user.checkPassword(password, user.password);
        if(!isCorrectPassword) return next(new AppError("Password is not correct", 401))
        const token = generateToken({id: user._id, rollNumber: user.rollNumber});
        if(!token) return next(new AppError("Token doesn't exists", 404))
        res.status(200).json(
                {
                    status: "success",
                    user,
                    token
                }
            )
    }
)

exports.login = catchAsync(
    async (req, res, next)=>{
        const {rollNumber, password} = req.body;
      const user = await User.findOne(
        {
          $or: [
            {rollNumber: rollNumber},
            {name: rollNumber}
          ]
        }
      ).select('+password')

        if(!user) return next(new AppError("User not found", 404));
        const isCorrectPassword = await user.checkPassword(password, user.password);
        if(!isCorrectPassword) return next(new AppError("Password is not correct", 401))
        const token = generateToken({id: user._id, rollNumber: user.rollNumber});
        if(!token) return next(new AppError("Token doesn't exists", 404))
        res.status(200).json(
                {
                    status: "success",
                    user,
                    token
                }
            )
    }
)

exports.signUp = catchAsync(async (req, res, next) => {
  // Ensure that file upload happens before the rest of the signup process
  upload(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message || 'Error uploading file', 400));
    }

    // Destructure the fields from the request body
    const { name, password, rollNumber, role, year, phone, email } = req.body;

    console.log(req.body);
    // Check if all required fields are provided
    if (!name || !password || !rollNumber || !role || !year || !phone || !email) {
      return next(new AppError('Please provide all required fields.', 400));
    }

    // If no file uploaded, default to the default image
    const imagePath = req.file ? req.file.path : 'defaultProfile.jpg';
    const relativePath = imagePath.split("uploads")[1]; // Get everything after "uploads"
    const profileImg = `/uploads${relativePath}`;
    console.log(profileImg)
    // console.log(req.file.path)

    const userData = {
      profileImg,
      phoneNumber: phone,
      email: email,
      role,
      name,
      password, // Save the hashed password
      rollNumber,
      year
    };

    // Check if the user already exists
    const existingUser = await User.findOne({ rollNumber });
    if (existingUser) {
      return next(new AppError('User with this roll number already exists.', 400));
    }

    // Create the new user
    const newUser = await User.create(userData);


    if (!newUser) {
      return next(new AppError('User creation failed', 400));
    }

    res.status(201).json({
      status: 'created',
      data: { newUser }
    });
  });
});


