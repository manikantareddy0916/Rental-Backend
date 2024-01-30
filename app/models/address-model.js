const mongoose = require('mongoose')
const User = require('./user-model')
const {Schema, model} = mongoose

const addressSchema = new Schema({
    place: String,
    houseNumber:String,
    street: String,
    pinCode: String,
    city: String,
    myState: String,
    country: String,
    latitude: String,
    longititude:String,
    addressOwner:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    products :[{
        type:Schema.Types.ObjectId,
        ref: 'Product'
    }]

})

const Address = model('Address', addressSchema)
module.exports = Address