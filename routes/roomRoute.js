const express = require('express')
const roomController = require('./../controllers/roomController')
const router = express(); 


router.post('/', roomController.createRoom)
router.get('/test/:userId', roomController.getRoomsByUser)


module.exports = router