const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        profileImg: {
            type: String,
            default: 'defaultProfile.jpg',
        },
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            trim: true
        },
        phoneNumber: {
            type: String,
            required: [true, 'phoneNumber is required'],
            trim: true
        },
        rollNumber: {
            type: String,
            required: [true, 'rollNumber is required'],
            unique: true, 
        },
        year: {
            type: String,
            required: [true, 'year is required'],
            enum: {
                values: ["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year"],
                message: "Year must be one of the values"
            }
        },
        password:{
            type: String,
            required: [true, 'password is required'],
            select: false
        },
        role: {
            type: String,
            default: "student",
            enum: {
                values: ["admin", "student"],
                message: "role must be admin and student"
            }
        },
        appliedFaceReko: {
            type: Number,
            default: 0
        }
    }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    return next();
})


userSchema.methods.checkPassword = async (password, hashedPassword)=>{
    return await bcrypt.compare(password, hashedPassword);
}



const User = mongoose.model('User', userSchema)

module.exports = User;