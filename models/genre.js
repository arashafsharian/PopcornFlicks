const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    }
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50)
    })
    return schema.validate(genre)
}

exports.Genre = Genre
exports.genreSchema = genreSchema
exports.validate = validateGenre
