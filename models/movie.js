const Joi = require('joi')
const mongoose = require('mongoose')
const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        max: 255
    }

})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255)
    })
    return schema.validate(movie)
}

exports.Movie = Movie
exports.validate = validateMovie