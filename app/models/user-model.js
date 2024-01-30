const mongoose = require('mongoose')
const {Schema, model}= mongoose

const userSchema = new Schema ({
    userName : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum : ['admin','user'],
        default : 'user'
    },
    products : [{
        type : Schema.Types.ObjectId,
        ref : 'Product'
    }],
    rentalProducts : [{
        type : Schema.Types.ObjectId,
        ref : 'Product'
    }],
    rentalDetails : [{
        type: Schema.Types.ObjectId,
        ref : 'RentalProduct'
    }],
    requestsId : [{
        type : Schema.Types.ObjectId,
        ref : 'RentalProduct'
    }],
    address :[{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    profilePicture: String
}, {timestamps: true})

const User = model('User', userSchema)

module.exports = User