const express = require('express')
const authController = require("./../controllers/authController")
const router = express.Router()
const multer = require('multer')



const upload = multer({ dest: 'uploads/data/userid/images' });


router
    .route('/login')
    .post(authController.login)


router
    .route('/adminlogin')
    .post(authController.adminLogin)




router
    .route('/signup')
    .post(authController.signUp)

module.exports = router;