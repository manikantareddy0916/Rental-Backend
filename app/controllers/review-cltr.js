const { validationResult } = require("express-validator")
const Product = require("../models/product-model")
const Review = require("../models/review-model")

const reviewCltr = {}

//Adding Comment
reviewCltr.add = async function(req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        const body = req.body
        const userid = req.user.id
        const pId = req.params.pId//product id
        const review = new Review(body)
        review.user = userid
        review.product = pId
        await review.save()
        await Product.findOneAndUpdate({_id:pId},{$push:{review : review._id}})
        res.status(201).json(review)
    }
    catch(e){
        res.status(500).json(e)
    }
}
//edit comment
reviewCltr.edit = async function(req,res){
    try{
        const pId = req.params.pId
        const userid = req.user.id
        const rid = req.params.rId 
        const body = req.body
        //here we can also do findOne(_id: reviewid, user: userid)
        //const review = await Review.findOneAndUpdate({_id: revid, user: userid},body)
        const review = await Review.findOneAndUpdate({_id: rid, product: pId, user: userid},body)
        //const review = await Review.findOneAndUpdate({product: pId, user: userid} , body)
        console.log('r',review)
        res.status(200).json(review)
    }
    catch(e){
        res.status(500).json(e)
    }
}
//Delete comment
reviewCltr.delete = async function(req,res){
    const rId = req.params.rId //reviewid
    const userid = req.user.id 
    const pId = req.params.pId //productid
    try{
        if(req.user.role == 'admin'){
            const review = await Review.findOneAndDelete({_id: rId, product:pId})
            return res.status(200).json(review)
        }
        else{
            const review = await Review.findOneAndDelete({_id: rId, user: userid, product:pId})
            return res.status(200).json(review)
        }
    }
    catch(e){
        res.status(500).json(e)
    }
}
module.exports = reviewCltr

// 500 comes in catch block
// 200 comes in try block
// 201 comes in try block saved posts
// 400 comes in save validation
// 401 unauthorised for token validation
// 403 forbidden
// 404 no record found in db