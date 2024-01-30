const User = require('../models/user-model')

const userNameSchema = {
        notEmpty :{
            errorMessage :'userName is required'
        }
}

const emailRegisterSchema = {
        notEmpty : {
            errorMessage : 'email is required'
        },
        isEmail : {
            errorMessage : 'valid Email required'
        },
        custom : {
            options : async (value)=>{
                const user = await User.findOne({email: value})
                if(user){
                    throw new Error('Email already exists')
                }else{
                    return true
                }
            }
        }
}
const emailLoginSchema ={
    notEmpty : {
        errorMessage : 'email is required'
    },
    isEmail : {
        errorMessage : 'valid email is required'
    }
}

const passwordSchema = {
        notEmpty : {
            errorMessage : 'password is required'
        },
        isStrongPassword: {
            options:{
                minLength:3,
                minUpperCase:1,
                minLowerCase:1,
                minSymbols:1
            },
            errorMessage : 'use atleast One Uppercase & LowerCase & Symble & Number'
        }
}


const userRegisterSchema = {
    userName : userNameSchema,
    email : emailRegisterSchema,
    password : passwordSchema
}
const userLoginSchema = {
    email : emailLoginSchema,
    password : passwordSchema
}

module.exports = {
    userRegisterSchema,
    userLoginSchema
}