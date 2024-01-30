const mongoose = require('mongoose')
const {Schema, model} = mongoose

const reviewModel = new Schema ({
    comment: String,
    rating: String,
    product: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Review = model('Review', reviewModel)
module.exports = Review