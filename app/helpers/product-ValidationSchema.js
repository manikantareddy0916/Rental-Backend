
const productNameSchema = {
    notEmpty:{
        errorMessage:' productName is required'
    },
    isLength:{
        options:{min : 2 , max:15},
        errorMessage:"min 2 and max 15"
    }
}
const productSpecificationsSchema = {
    notEmpty:{
        errorMessage:' specifications is required'
    }, 
    isLength:{
        options:{min : 10},
        errorMessage:"minium length is 10  "
    }
}
const productImageSchema = {
    notEmpty:{
        errorMessage:' image is required'
    }
}
const productPriceSchema = {
    notEmpty:{
        errorMessage:' price  is required'
    }
}
const productMobileNumber = {
    notEmpty:{
        errorMessage:' mobileNumber is required'
    },
    isLength:{
        options: { min:10, max:10}
    }
}
const categorySchema ={
    notEmpty:{
        errorMessage:'category is required'
    }
}

const productValidationSchema ={
    productName : productNameSchema,
    productSpecifications : productSpecificationsSchema,
    productImage : productImageSchema,
    productPrice : productPriceSchema,
    mobileNumber : productMobileNumber,
    //category : categorySchema
}

module.exports = productValidationSchema