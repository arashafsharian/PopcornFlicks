const auth = require('../middleware/auth')
const { Customer, validate } = require('../models/customer')
const express = require('express')
const router = express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(404).send(error.details[0].message)

        const customer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        })
        await customer.save()
        res.send(customer)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const customers = await Customer.find()
            .select('-__v')
            .sort('name')
        res.send(customers)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).send('The Customer with the given ID was not found.')
        res.send(customer)
    }
    catch (ex) {
        next(ex)
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }, { new: true })
        if (!customer) return res.status(404).send('The Customer with the given ID was not found.')
        res.send(customer)
    }
    catch (ex) {
        next(ex)
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id)
        if (!customer) return res.status(404).send('The Customer with the given ID was not found.')
        res.send(customer)
    }
    catch (ex) {
        next(ex)
    }
})

module.exports = router