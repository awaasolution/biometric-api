const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: {
                values: ['present', 'absent'],
                message: "{VALUE} must be present or absent"
            }
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)


const Record = mongoose.model('Record', recordSchema)

module.exports = Record






