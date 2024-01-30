
const commentSchema ={
    notEmpty:{
        errorMessage :"not empty the field"
    }
}
const ratingSchema={
    notEmpty:{
        errorMessage: 'not empty the field'
    }
}

const reviewValidationSchema ={
    comment : commentSchema,
    rating: ratingSchema
}

module.exports = reviewValidationSchema