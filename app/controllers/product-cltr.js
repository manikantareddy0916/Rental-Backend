const { validationResult } = require('express-validator')
const Product = require('../models/product-model')
const User = require ('../models/user-model')
const uploadToS3 = require('../middlewares/imageupload')
const _ = require('lodash')
const Address = require('../models/address-model')


const productCltr = {}

productCltr.listQuery = async function(req,res){
    const {search,sort} = req.query
    try {
        let matchCriteria ={}
        if(search){
            matchCriteria = {
                productName:{$regex:search, $options: 'i'}
            }
        }

        const aggregationPipeline = []

        if (Object.keys(matchCriteria).length !== 0) {
            aggregationPipeline.push({ $match: matchCriteria });
        }

        if (sort) {
            let sortCriteria = {};
      
            switch (sort) {
              case "lowest-highest":
                sortCriteria = { productPrice: 1 };
                break;
              case "highest-lowest":
                sortCriteria = { productPrice: -1 };
                break;
              case "a-z":
                console.log('a-z')
                sortCriteria = { productName: 1 };
                break;
              case "z-a":
                sortCriteria = { productName: -1 };
                break;
              default:
                sortCriteria = { productName: 1 }; // Default to sorting by title asc
                break;
            }
      
            aggregationPipeline.push({ $sort: sortCriteria });
        }
        if(aggregationPipeline.length > 0){
            const products = await Product.aggregate(aggregationPipeline )
            //console.log('q',products)
            res.json(products)
        }
    
}catch (e) {
    res.status(500).json(e)
}
}
//Creating adding Product 
productCltr.add = async function(req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
     const body = _.pick(req.body,['productName','productSpecifications','productPrice','mobileNumber','address','review','category','productImage','radius','lat','long','stock'])
    //const body = req.body
    //console.log('ad',req.body)
    try{
        const userid = req.user.id
        const filesData = req.files 
       // console.log('filedata',filesData)
        //uploading image to s3
        let images =[]
        //console.log('img',images)
        for(const file of filesData){
            const uploadResult = await uploadToS3(file)
            // console.log('kkkkkkk',uploadResult)
            images.push(uploadResult)   
        }
        //console.log('img',images)
        body.productImage = images
        const product = new Product(body)
        product.productOwner = userid
        //product.address = req.user.address
        //await product.findOneAndUpdate({ productOwner : userid}, {$push: {}})
        //console.log('ok',req.user.role)
        await product.save()
        //console.log('req.files2',req.files)
        //await User.findByIdAndUpdate(userid, {$push: {products: product._id}})
        await User.findOneAndUpdate({_id: userid}, {$push: {products: product._id}})
        //await Product.findOneAndUpdate({productOwner: req.user.id,addressOwner: same}, {${push:{latitiuse : f}}})
       // console.log('adbd',)
       //adding product to address
        //await Address.findOneAndUpdate({addressOwner : userid},{$push:{products: product._id}})
        //await Product.findOneAndUpdate({productOwner : userid}, {$push: {address: }})
        res.status(201).json(product)
    }
    catch(e){
        res.status(500).json(e)
    }
}

//Edit/update
productCltr.update = async function(req,res){  
    const pId = req.params.pId 
    const body = _.pick(req.body,['productName','productSpecifications','productPrice','mobileNumber','address','review','category','productImage','radius','lat','long','stock'])
    //console.log('edit',req.body)
    console.log('edit',body)
    try{
       
        const userid = req.user.id 
        console.log('_id',pId)
        console.log('productOwner',userid)
        // const filesData = req.files 
        // let images =[]
        // for(const file of filesData){
        //     const uploadResult = await uploadToS3(file)
        //     //console.log('kkkkkkk',uploadResult)
        //     images.push(uploadResult)
        // }
        // body.productImage = images
        const product = await Product.findOneAndUpdate({_id: pId, productOwner: userid}, body,{new : true})
        //console.log('productupdate',product)
        res.status(200).json(product)
    }
    catch(e){
        res.status(500).json(e)
     }
}
//after Payment product hiding opaicty
productCltr.updateStock = async function(req,res){
    const pId = req.params.pId 
    const userId = req.user.id
    try{
        const product = await Product.findOneAndUpdate({_id: pId},{stock: 'notAvailable'},{new: true})
        res.status(200).json(product)
    }catch(e){
        res.status(500).json(e)
    }
}
productCltr.makeAvailable = async function(req, res){
    const pId = req.params.pId 
    const userId = req.user.id 
    try{
        const product = await Product.findOneAndUpdate({_id : pId, productOwner: userId}, {stock: 'available'},{new: true})
        //console.log('kas',product)
        res.json(product)
    }catch(e){
        res.status(500).json(e)
    }
}
//display ONE (particular) owner product   (its for displaying all products of the owner)
productCltr.list = async function(req,res){
    const userid = req.user.id
    
    try{
        const product = await Product.find({ productOwner : userid })
        //console.log("skip",product)
        res.status(200).json(product)
    }catch(e){
        res.status(500).json(e)
    }
}

//display all products viewing all products (for users displaying all)
productCltr.listAll =async function(req,res){
    // const {page } = req.query
    // const limit = 3
    // .skip((page-1)*limit).limit(limit)
    const {search}= req.query
    try{
        const product = await Product.find()
        //console.log('jk', product)
        res.status(200).json(product)
    }catch(e){
        res.status(500).json(e)
    }
}
// user and admin ascess to delete
productCltr.delete = async function(req,res){
    const pId= req.params.pId
    const userid = req.user.id
    try{
        if(req.user.role == 'admin'){
            const data =await Product.findOneAndDelete({_id: pId})
            res.status(200).json(data)
        }else{
            const data =await Product.findOneAndDelete({_id: pId, productOwner: userid})
            res.status(200).json(data)
        }
    }catch(e){
        res.status(500).json(e)
    }
}
module.exports = productCltr