const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = mongoose.model('UserModel');
const protectedRoute = require('../middleware/protectedResource')
const { JWT_SECRET } = require('../config');
const isAuth = require('../middleware/isAuth');

router.post('/signup', (req, res) => {
    const { fullName, contactNumber, email, password, confirmPassword } = req.body;
    if (!fullName || !contactNumber || !email || !password) {

        return res.status(400).json({ error: "One or more mandatory fields are empty" });

    } else if (password !== confirmPassword) {
        return res.status(401).json({ error: "password do not match" })
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already exist" })
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {

                    const user = new UserModel({ fullName, contactNumber, email, password: hashedPassword })
                    user.save()
                        .then((newUser) => {
                            return res.status(201).json({ result: newUser })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((err) => {
            console.log(err);
        })
});

// router.get('/')

//update user details with its email
router.put('/updateuser', (req, res) => {
    // const userId = req.params.userId;
    const { fullName, contactNumber, email, password } = req.body;

    bcryptjs.hash(password, 16)
        .then((hashedPass) => {
            UserModel.findOneAndUpdate({ email }, { $set: { fullName, contactNumber, password: hashedPass } }, {
                new: true
            })
                .then((updatedUser) => {
                    if (!updatedUser) {
                        return res.status(401).json({ error: "User Not found" })
                    }

                    return res.status(200).json({ result: "Updated succesfully", user: updatedUser })


                }).catch((error) => {
                    console.log(error);
                })
        }).catch((error) => {
            console.log(error);
        })

})


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: 'One or more fields are empty' })
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: 'Invalid email/password' })
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, 'email': userInDB.email, 'fullName': userInDB.fullName, 'contactNumber': userInDB.contactNumber, "isAuth": userInDB.isAuth }
                        return res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: 'Invalid email/password' })
                    }
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((err) => {
            console.log(err);
        })
});

//profile: get my profile details
router.get('/getprofile', protectedRoute, (req, res) => {
    UserModel.findById(req.user._id)
        .then((userInDB) => {
            return res.status(200).json({ userDetails: userInDB })
        }).catch((error) => {
            console.log(error);
        })
})

router.get('/alluser', protectedRoute, isAuth, (req, res) => {
    UserModel.find()
        .then((allUsers) => {
            return res.status(200).json({ allUsers })
        }).catch((error) => {
            console.log(error)
        })
})

//seeding admin usermodel as Admin
router.post('/seedadmin', (req, res) => {
    bcryptjs.hash('delhi', 16)
        .then((hashedPass) => {
            const newUser = new UserModel({
                fullName: "pragnesh",
                contactNumber: "8810441448",
                email: "pragnesh@gmail",
                isAuth: true,
                password: hashedPass
            })
            newUser.save()
                .then((newUser) => {
                    return res.status(200).json({ user: newUser })
                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error);
        })
})

//seeding user
router.post('/seeduser', (req, res) => {
    bcryptjs.hash('delhi', 16)
        .then((hashedPass) => {
            const newUser = new UserModel({
                fullName: "pragnesh1",
                contactNumber: "8810441448",
                email: "pragnesh1@gmail",
                password: hashedPass
            })
            newUser.save()
                .then((newUser) => {
                    return res.status(200).json({ user: newUser })
                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error);
        })
})

module.exports = router