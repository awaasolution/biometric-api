const jwt = require('jsonwebtoken')

exports.generateToken = ({id, rollNumber})=>{
    const token = jwt.sign(
        {
            id,
            rollNumber
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
    return token;
}

exports.verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}