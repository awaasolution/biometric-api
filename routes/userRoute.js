const express = require('express')
const router = express.Router()
const userController = require('./../controllers/userController')
const User = require('../models/userModel')
const Record = require('../models/recordModel')
const Message = require('../models/messageModel')


router
    .route('/listall/:me')
    .get(userController.getAllUsers)

router
    .route('/listall/admins/:me')
    .get(userController.getAllAdmins)

router
    .route('/')
    .get(userController.getUserByName)

router
    .route('/:id')
    .get(userController.getUserById)
    .delete(userController.deleteUserById)
    .patch(userController.updateUserById)

    
router
    .patch('/applied/:id', async(req, res,next)=>{
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, {
            appliedFaceReko: true
        })

        res.status(203).json(
                {
                    status: 'updated',
                    updatedUser
                }
        )
    })

router
    .patch('/name/:id', async(req, res,next)=>{
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, {
            name: req.body.name
        })

        res.status(203).json(
                {
                    status: 'updated',
                    updatedUser
                }
        )
    })

router
    .patch('/email/:id', async(req, res,next)=>{
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, {
            email: req.body.email
        })

        res.status(203).json(
                {
                    status: 'updated',
                    updatedUser
                }
        )
    })

router
    .patch('/phone/:id', async(req, res,next)=>{
        const id = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(id, {
            phone: req.body.phone
        })

        res.status(203).json(
                {
                    status: 'updated',
                    updatedUser
                }
        )
    })

router.patch('/password/:id', async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user with the hashed password
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true } // Return the updated user object
    );

    res.status(203).json({
        status: 'updated',
        updatedUser,
    });
});






router
    .delete('/account/:id', async(req, res,next)=>{
        const id = req.params.id;
        await Record.deleteMany({user: id})
        await Message.deleteMany({$or: [{senderId: id}, {receiverId: id}]})
        const deleted = await User.findByIdAndDelete(id)
        res.status(203).json(
                {
                    status: 'deleted',
                    updatedUser
                }
        )
    })






module.exports = router; 