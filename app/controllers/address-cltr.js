const Address = require('../models/address-model')
const User = require('../models/user-model')
const _ =require('lodash')
const {validationResult} = require('express-validator')
//const Product = require('../models/product-model')

const addressCltr ={}

//Address adding
addressCltr.add = async function (req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    //console.log('hj',req.body)
    const body = _.pick(req.body,['place','street','pinCode','city','myState','country','latitude','longititude','products','houseNumber']) 
    //const body = req.body
   // console.log('bg',body)
   //console.log('my')
    try{
       // console.log('kk',body)
        
        const address = new Address(body)
        address.addressOwner = req.user.id
        // address.latitude = body.latitude
        // address.longititude = body.longititude
        await address.save()
        await User.findOneAndUpdate({_id: req.user.id}, {$push:{ address: address._id}})
        // await Product.findOneAndUpdate( { productOwner : req.user.id }, {$push:{ address : address._id}} )
        res.status(201).json(address)
        //console.log('afff',address)
    }
    catch(e){
        res.status(500).json(e)
    }
}
//Edit address
addressCltr.update = async function(req,res){
    try{
        const aId = req.params.aId
        const userid= req.user.id
        const body = req.body
        const address = await Address.findOneAndUpdate({_id: aId, addressOwner: userid},body)
        res.status(200).json(address)
    }catch(e){
        res.status(500).json(e)
    }
}
//Get Address of single user
addressCltr.address = async function(req,res){
    try{
        
        const address = await Address.find({addressOwner: req.user.id}).populate('products')
        //console.log('jj',req.user.id,address)
        res.status(200).json(address)
    }
    catch(e){
        res.status(500).json({ errors: 'something went wrong/add token'})
    }
}
//get all users address 
addressCltr.allAddress = async function(req, res){
    try{
        const address = await Address.find()//.populate('products')
        res.status(200).json(address)
    }
    catch(e){
        res.status(500).json(e)
    }
}
module.exports = addressCltr