const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Genre, validate } = require('../models/genre')
const express = require('express')
const router = express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const genre = new Genre({
            name: req.body.name
        })
        await genre.save()
        res.send(genre)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const genres = await Genre.find().sort('name')
        res.send(genres)
    }
    catch (ex) {
        next(ex)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id)
        if (!genre) return res.status(404).send('The Genre with the given ID was not found.')
        res.send(genre)
    }
    catch (ex) {
        next(ex)
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
        if (!genre) return res.status(404).send('The Genre with the given ID was not found.')
        res.send(genre)
    }
    catch (ex) {
        next(ex)
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id)
        if (!genre) return res.status(404).send('The Genre with the given ID was not found.')
        res.send(genre)

    }
    catch (ex) {
        next(ex)
    }
})

module.exports = router