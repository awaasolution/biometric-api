const mongoose = require("mongoose");
const User = require("../models/userModel"); // Import the User model
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ApiFeature = require("../utils/apiFeatures");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { me } = req.params;
  const user = await User.find({_id: {$ne: me}, role: {$ne: "admin"}});
  res.status(200).json({
    status: "success",
    count: user.length,
    data: { user: user }
  });
});


exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const { me } = req.params;
  const user = await User.find({_id: {$ne: me}, role: "admin"});
  res.status(200).json({
    status: "success",
    count: user.length,
    data: { user: user }
  });
});


exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user}
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { name, rollNumber, year} = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, rollNumber, year },
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user: updatedUser }
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user: deletedUser }
  });
});


// for the chat search box
exports.getUserByName = catchAsync(
    async (req, res, next)=>{
        const name = req.query.name
        console.log(name)
        const user = await User.find({name: `${name}`})
        res.status(200).json(
            {
            status: 'success',
                data: {
                    user
                }
            }
        )
    }
)