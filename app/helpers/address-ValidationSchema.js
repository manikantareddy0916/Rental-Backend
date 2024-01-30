
const placeSchema ={
    notEmpty:{
        errorMessage:" place field is required"
    }
}
const streetSchema ={
    notEmpty:{
        errorMessage:'street field is required'
    }
}
const pinCodeSchema ={
    notEmpty:{
        errorMessage:'pinCode field is required'
    }
}
const citySchema ={
    notEmpty:{
        errorMessage:'city field is required'
    }
}
const stateSchema ={
    notEmpty:{
        errorMessage:'state field is required'
    }
}
const countrySchema ={
    notEmpty:{
        errorMessage:'country field is required'
    }
}
const houseNumberSchema ={
    notEmpty:{
        errorMessage:'Housenumber is required'
    }
}

const latitudeSchema = {
    notEmpty : {
        errorMessage : 'lat required'
    }
}

const longititudeSchema = {
    notEmpty : {
        errorMessage : 'long required'
    }
}

const addressValidationSchema = {
    place: placeSchema,
    houseNumber: houseNumberSchema,
    street: streetSchema,
    pinCode: pinCodeSchema,
    city: citySchema,
    myState: stateSchema,
    country: countrySchema,
    latitude : latitudeSchema,
    longititude : longititudeSchema
}

module.exports = addressValidationSchema