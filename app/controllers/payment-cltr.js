const Payment = require('../models/payment-model')
const _ = require('lodash')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const paymentCltr = {}

paymentCltr.create = async (req,res) => {
    const body = _.pick(req.body,['rentalProductId','totalPrice','productName','days','productId'])    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price_data: {
                currency: "inr",
                product_data: {
                  name: "Booking Product Fee",
                },
                unit_amount: body.totalPrice * 100,
              },
              quantity: 1
            }],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}success`,
            cancel_url: `${process.env.FRONTEND_URL}cancel`,
          })
      
        const payment = new Payment(body)
        payment.user = req.user.id,
        payment.transactionId = session.id
        payment.rentalProductId = body.rentalProductId 
        //payment.userEmail = body.userEmail
        payment.totalAmount = body.totalPrice
        
        await payment.save()
        //console.log('pay',payment)
        // if(body.userEmail){
        //     const info = await transporter.sendMail({
        //         from: `Shrikant Shivangi ${process.env.NODE_MAILER_MAIL}`, // sender address
        //         to: `${body.userEmail}`, // list of receivers
        //         subject: "Order Recieved", // Subject line
        //         text: "We have recieved your order.Thanks! for being a part of reStock.", // plain text body
        //         html: "<b>We have recieved your order.Thanks! for being a part of reStock.</b>", // html body
        //       });
        
        //       //console.log("Message sent: %s", info.messageId);
        // }
        res.json({
            url :session.url,
            id : session.id
        })
       
    } catch (e) {
        console.log('pc',e)
    }
}

paymentCltr.update = async (req,res) => {
    const {id} = req.params
    try {
        const updatePayment = await Payment.findOneAndUpdate(
            {transactionId:id},{paymentStatus:'Successfull'},{new:true}
        )
        
        res.json(updatePayment)
    } catch (e) {
        res.status(500).json({errors:[{msg:e.message}]})
    }
}


paymentCltr.userList = async(req,res)=>{
    try{
        const userId = req.user.id
        const paymentList = await Payment.find({user: userId , paymentStatus: 'Successfull'})
        //console.log('pay',paymentList)
        res.json(paymentList)
    }catch{
        res.status(500).json({errors:[{msg: e.message}]})
    }
}
// paymentCltr.list = async(req,res) => {
//     try{
//         const paymentList = await Payment.find({status:'pending'})
//         res.json(paymentList)
//     } catch(e){
//         res.status(500).json({errors:[{msg:e.message}]})
//     }
// }

paymentCltr.delete = async(req,res)=> {
    const {id} = req.params
    try {
        const deletePayment = await Payment.findOneAndDelete({transactionId:id})
        res.json(deletePayment)
    } catch (e) {
        res.status(500).json({errors:[{msg:e.message}]})
    }
}

module.exports = paymentCltr