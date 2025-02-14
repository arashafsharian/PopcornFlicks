const auth = require('../middleware/auth')
const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const express = require('express')
const router = express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const customer = await Customer.findById(req.body.customerId)
        if (!customer) return res.status(400).send('Invalid customer.')

        const movie = await Movie.findById(req.body.movieId)
        if (!movie) return res.status(400).send('Invalid movie.')

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')
        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        })
        await rental.save()

        movie.numberInStock--
        await movie.save()
        res.send(rental)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut')
        res.send(rentals)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).select('-__v')

        if (!rental) return res.status(404).send('The rental with the given ID was not found.')
        res.send(rental)
    }
    catch (ex) {
        next(ex)
    }
})

module.exports = router