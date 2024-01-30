const { validationResult } = require('express-validator')
const Category = require('../models/category-model')
const categoryCltr = {}

//adding category
categoryCltr.add = async function(req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const body = req.body 
    try{
        const category = new Category(body)
        await category.save()
        res.status(201).json(category)
    }
    catch(e){
        res.status(500).json(e)
    }
}

//list all categoryes
categoryCltr.list = async function(req,res){
    try{
        const category = await Category.find()
        res.status(200).json(category)
    }catch(e){
        res.status(500).json(e)
    }
}

//delete category
categoryCltr.delete = async function(req,res){
    try{
        const cId = req.params.cId
        const category = await Category.findOneAndDelete({_id: cId})
        res.status(200).json(category)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = categoryCltr