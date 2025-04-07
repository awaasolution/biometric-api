const express = require('express')
const messageController = require('./../controllers/messageController')

const router = express(); 


router.post('/', messageController.sendMessage)
router.get('/:roomName', messageController.getMessagesInRoom)
router.get('/admin/:loggedUserId', messageController.getMessagesById)


module.exports = router