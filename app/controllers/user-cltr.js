const User = require('../models/user-model')
const _ = require('lodash')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const userCltr = {}

//Register
userCltr.register = async function (req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const body = _.pick(req.body,['userName','email','password']) 
    try{
        const user = new User(body) 
        const salt = await bcryptjs.genSalt()
        const hashedPassword = await bcryptjs.hash(user.password, salt)
        const totalUsers = await User.countDocuments()
        user.password = hashedPassword
        if(totalUsers == 0){
            user.role = 'admin'
        }
        await user.save()
        //creating so 201
        res.status(201).json({msg:"Congratulations, You are registered! Check you email to sign in."})

    }
    catch(e){
        //internal server error
        res.status(500).json(e)
    }
}
//Login
userCltr.login = async function (req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()})
    }
    const body= _.pick(req.body,['email','password'])
    try{
        //verfing email
        const user = await User.findOne({email: body.email})
        //console.log('1',user)
        if(!user){
            return res.status(404).json({errors: [{ msg: 'invalid email/password'}]})
        }
        //verfing password  
        const result = await bcryptjs.compare(body.password , user.password)
        //console.log('2',result)
        if(!result){
            return res.status(404).json({errors: [{msg : 'invalid email/password'}]})
        }
        //token generating and Bearer
        const tokenData = {id : user._id, role : user.role } 
        const token = jwt.sign(tokenData, process.env.JWT_SECRET)
        res.status(200).json({token : `Bearer ${token}`})
    }
    catch(e){
        res.status(500).json(e)
    }
}
//Account
userCltr.account = async function(req,res){
    try{
        const user = await User.findById(req.user.id).populate('products',['_id','productName']).populate('address').populate('rentalDetails')
       // console.log('jj',user)
        
            //console.log('User populated successfully:', user);
            res.status(200).json(user);
        
    }
    catch(e){
        res.status(500).json({ errors: 'something went wrong/add token'})
    }
}
//get all accounts only for admin use find()
userCltr.allAccounts = async function(req,res){
    try{
        const user = await User.find()
        res.status(200).json(user)
    }catch(e){
        res.status(500).json(e)
    }
}
//delete particular user only admin
userCltr.deleteuser = async function(req,res){
    try{
        const uId = req.params.uId 
        const user = await User.findOneAndDelete({_id: uId})
        res.status(200).json(user)
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = userCltr