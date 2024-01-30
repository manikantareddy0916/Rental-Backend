const jwt = require('jsonwebtoken')
const _ = require('lodash')


const authenticateUser = (req,res,next)=>{
    let token = req.headers['authorization']
    if(!token){
        return res.status(401).json({ errors: 'authentication user'})
    }
    token = token.split(' ')[1]
    try{
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = _.pick(tokenData, ['id','role',])
        next()
    }catch(e){
        res.status(401).json({error: 'error authentication'})
    }
}
//hear u get USER ID of the login user

const permitUser = (role)=>{
    return function (req,res,next){
        if(role.includes(req.user.role)){
            next()
        }else{
            res.status(403).json({errors: 'you are not permited '})
        }
    }
}

module.exports = {
    authenticateUser,
    permitUser
}