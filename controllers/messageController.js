const Message = require('../models/messageModel');
const Room = require('../models/roomModel');
const catchAsync = require('../utils/catchAsync'); // Assuming you have a catchAsync utility
const AppError = require('../utils/AppError'); // Assuming you have an AppError utility

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { name, senderId, receiverId, message } = req.body;

  // Validate if room exists
  console.log(name)
  const roomId = await Room.findOne({name}).select("_id");
  console.log(roomId)

  const room = await Room.findById(roomId);
  if (!room) { 
    return next(new AppError('Room not found.', 404));
  }

  // Check if the sender and receiver are part of the room
  if (!room.users.includes(senderId) || !room.users.includes(receiverId)) {
    return next(new AppError('Sender or receiver is not part of this room.', 403));
  }

  // Create a new message in db
  const newMessage = await Message.create({
    roomId,
    senderId,
    receiverId,
    message,
  });

  res.status(201).json({
    message: 'Message sent successfully',
    newMessage,
  });
});

exports.getMessagesInRoom = catchAsync(async (req, res, next) => {
  const { roomName } = req.params;

  // Fetch messages for a particular room
  const roomId = await Room.findOne({name: roomName}).select('_id');
  const messages = await Message.find({ roomId }).select("senderId receiverId message timestamp");
    // .populate('senderId', "name") // Optionally populate sender info
    // .populate('receiverId', "name"); // Optionally populate receiver info

  res.status(200).json({
    message: 'Messages fetched successfully',
    messages,
  });
});


exports.getMessagesById = async (req, res, next)=>{
  const {loggedUserId} = req.params;
  const messages = await Message.find({$or: [{senderId: loggedUserId}, {receiverId: loggedUserId}]}).populate('senderId receiverId');

  res.status(200).json(
    {
      status: "success",
      message: "get messages by userId for admin",
      messages
    }
  )
}