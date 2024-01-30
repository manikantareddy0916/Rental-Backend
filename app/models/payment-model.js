const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rentalProductId : {
    type: Schema.Types.ObjectId,
    ref : 'RentalProduct'
  },
  totalAmount: Number,
  paymentType: String,
  transactionId: {
    type: String,
    default: null
  },
  productName : String, 
  productId : {
    type : Schema.Types.ObjectId,
    ref : 'Product'
} ,
  days: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'Successfull'],
    default: "pending"
  }
}, { timestamps: true })

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
