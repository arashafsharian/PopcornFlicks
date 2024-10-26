const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const express = require('express')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v')
        res.send(user)
    }
    catch (ex) {
        next(ex)
    }
})

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send('User already registered.')

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()

        const token = user.generateAuthToken()

        res.header('X-Auth-Token', token).send({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }
    catch (ex) {
        next(ex)
    }
})

module.exports = router