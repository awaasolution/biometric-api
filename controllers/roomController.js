const Room = require('../models/roomModel'); // Assuming Room model is inside models/Room.js
const AppError = require('../utils/AppError');  // Import AppError
const catchAsync = require('../utils/catchAsync');  // Import catchAsync

// Create Room (1v1 or Group)
exports.createRoom = catchAsync(async (req, res, next) => {
  const { user1Id, user2Id, roomType = 'private', name } = req.body;

  // Ensure that user1 and user2 are not the same
  if (user1Id === user2Id) {
    return next(new AppError("Users cannot be the same.", 400));
  }

  // Check if the room already exists for 1v1 (private)
  const existingRoom = await Room.findOne({
    users: { $all: [user1Id, user2Id] },
    roomType: 'private',
  });

  if (existingRoom) {
    return res.status(200).json({ message: "Room already exists", room: existingRoom });
  }

  // Create a new room
  const room = new Room({
    name: name || 'Private Chat', // Default name for private chat
    users: [user1Id, user2Id],
    roomType: roomType, // Default to 'private' if not specified
  });

  await room.save();
  return res.status(201).json({ message: "Room created successfully", room });
});

// Get Rooms by User
exports.getRoomsByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  // Fetch rooms where the user is part of
  const rooms = await Room.find({ users: userId });

  if (!rooms || rooms.length === 0) {
    return next(new AppError("No rooms found for this user.", 404));
  }

  return res.status(200).json({ message: "Rooms fetched successfully", rooms });
});
