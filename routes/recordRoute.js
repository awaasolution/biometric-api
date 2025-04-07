const express = require('express')
const { getAllRecords, getAllRecordsByName, getAllRecordsByRollNumber, getAllRecordsByDate, createRecordById, getRecordsByUserId } = require('../controllers/recordController')
const router = express.Router()

// main Route

// api/records/
router
    .route('/')
    .get(getAllRecords)

router
    .route('/mark/:loggedUserId')
    .post(createRecordById)

router
    .route('/history/:userId')
    .get(getRecordsByUserId)


router
    .route('/:rollNumber')
    .get(getAllRecordsByRollNumber)

router
    .route('/:date')
    .get(getAllRecordsByDate)


router
    .route('/user/:name')
    .get(getAllRecordsByName)

module.exports = router;    