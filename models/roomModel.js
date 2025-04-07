const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        roomType: {
            type: String,
            enum: {
                values: ['private', 'group'],
                message: "roomType must be private or group"
            },
            default: 'private'
        }   
    }
)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room;