const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send('Invalid email or password.')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = user.generateAuthToken()
        res.send({ token })
    }
    catch (ex) {
        next(ex)
    }
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    })
    return schema.validate(req)
}

module.exports = router