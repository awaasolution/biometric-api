const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: [true, 'senderId is required']
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'receiverId is required']
        },
        message: {
            type: String,
            required: [true, 'message is required']
        },
        // mediaUrl: {
        //     type: String,
        //     default: null
        // },
        timestamp: {
            type: Date,
            default: Date.now
        },
        // status: {
        //     type: String,
        //     enum: {
        //         values: ['sent', 'delievered', 'read'],
        //         message: "status must have sent or delievered or read"
        //     },
        //     required: [true, 'status is missing']
        // },
        // repliedTo: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Message',
        //     default: null
        // },
    }
)


const Message = mongoose.model('Message', messageSchema)

module.exports = Message;