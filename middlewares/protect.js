const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { verifyToken } = require("../utils/jwtUtil");

exports.protect = catchAsync(
    async (req, res, next)=>{
        const token = req.headers?.['authorization'].split(' ')[1]
        if(!token) return next(new AppError("token doesn't exists in authorization"))
        const decoded = verifyToken(token)
        if(!decoded) return next(new AppError("token is invalid"))
        next();
    }
)