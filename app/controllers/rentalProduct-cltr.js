const uploadToS3 = require('../middlewares/imageupload')
const RentalProduct = require('../models/rentalProduct-model')
const User = require('../models/user-model')
const Address = require('../models/address-model')
const rentalProductCltr = {}


//Taking product for rent
//after clickig the product display form
rentalProductCltr.add = async function(req,res){
    const pId = req.params.pId //productid
    const userid = req.user.id//rentalUser
    const body = req.body 
    try{

        const filesData = req.files 
        let images = []
        //console.log('images',images)
        for ( const file of filesData){
            // console.log('files',file)
            // console.log('filesData',filesData)
            const uploadResult = await uploadToS3(file)
            //console.log('uploadResult',uploadResult)
            images.push(uploadResult)
        }
        body.aadhar = images

        const rentalProduct = new RentalProduct(body)
        rentalProduct.rentalUser =userid
        rentalProduct.product = pId
        await rentalProduct.save()
        //console.log('rentalProduct.rentalUser',rentalProduct.rentalUser)
        //console.log('rentalDetails._id',rentalProduct._id)
        await User.findOneAndUpdate({_id: userid}, { $push: {rentalProducts: pId} })
        //await User.findOneAndUpdate({_id: rentalProduct.rentalUser }, {$push: {rentalDetails : rentalProduct._id}})
        // await User.findOneAndUpdate({$push: {requestsId : rentalProduct._id}})
        //await User.findOneAndUpdate({products : pId}, {$push: {requestsId: rentalProduct._id}} )
        //console.log('fff',rentalProduct)
        res.status(200).json(rentalProduct)
    }
    catch(e){
        res.status(500).json(e)
    }
}
//view all taking rent products details  user // user taken products for rent
rentalProductCltr.list = async function(req,res){
    const userid = req.user.id
    try{
        const rentalProduct = await RentalProduct.find({rentalUser : userid})
        res.status(200).json(rentalProduct)
    }
    catch(e){
        res.status(500).json(e)
    }
}
//product id match ownerid productowenrid match display 
//in my account find in rentalProduct myproductsid and rentalProductid match show
rentalProductCltr.all = async function(req,res){      //no
    const userid = req.user.id 
    try{
       // console.log('address',Address._id)
        const rentalProduct = await RentalProduct.find().populate('product').populate('rentalUser',['userName','email'])
        //console.log('all',rentalProduct)
        res.status(200).json(rentalProduct)
    }catch(e){
        res.status(500).json(e)
    }
}

//get reqqest of product owner
rentalProductCltr.requests = async function (req,res){
    const userid = req.user.id 
    try{
        const rentalProduct = await RentalProduct.find({productOwner : userid }).populate('product').populate('rentalUser',['userName','email']).populate('productOwner')
        //console.log('no',rentalProduct)
        res.status(200).json(rentalProduct)
    }catch(e){
        res.status(500).json(e)
    }
}
rentalProductCltr.payCompleted = async function(req,res){
    try{
        const aId = req.params.aId //_id 
        const userId = req.user.id 
        //const body = req.body 
        //console.log("aksd",aId,userId)
        const rentalProduct = await RentalProduct.findOneAndUpdate({_id : aId, rentalUser: userId},{status: 'paymentDone'})
        //console.log('data',rentalProduct)
        res.status(200).json(rentalProduct)
    }
    catch(e){

    }
}
rentalProductCltr.accept = async function(req,res){

    try{
        const aId = req.params.aId //accept request _.id
        const userid= req.user.id
        //  const body = req.body
        //console.log('boe',body)
        //console.log('1',aId,userid)
        // await RentalProduct.findOneAndUpdate({_id : aId, productOwner: userid },{$push:{status : "accept"}})
        const rentalProduct = await RentalProduct.findOneAndUpdate({_id: aId, productOwner : userid },{status : 'accepted'})
        //productDetails
        console.log('rentalProdId',rentalProduct._id)
        await User.findOneAndUpdate({_id: req.user.id }, {$push: {rentalDetails : aId}})
        console.log('noo',aId)
        res.status(200).json(rentalProduct)
    }catch(e){
        res.status(500).json(e)
    }
}
module.exports = rentalProductCltr