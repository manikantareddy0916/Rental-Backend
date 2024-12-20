require ('dotenv').config()
const express = require ('express')
const cors = require('cors')
const {checkSchema} = require('express-validator')

const multer = require('multer')
//const multers3 = require('multer-s3')


const configureDB = require('./config/db')

const reviewCltr = require('./app/controllers/review-cltr')
const addressCltr = require ('./app/controllers/address-cltr')
const userCltr = require ('./app/controllers/user-cltr')
const productCltr = require ('./app/controllers/product-cltr')
const {userRegisterSchema, userLoginSchema} = require('./app/helpers/user-ValidationSchema')
const productValidationSchema = require('./app/helpers/product-ValidationSchema')
const addressValidationSchema = require('./app/helpers/address-ValidationSchema')
const reviewValidationSchema = require('./app/helpers/review-ValidationSchema')
const categoryValidationSchema = require('./app/helpers/category-ValidationSchema')
const {authenticateUser, permitUser} = require('./app/middlewares/authentication')
const categoryCltr = require('./app/controllers/category-cltr')
const rentalProductCltr = require('./app/controllers/rentalProduct-cltr')
const paymentCltr = require('./app/controllers/payment-cltr')

const port = 3666
const app = express()
app.use(express.json())
app.use(cors())
configureDB()
//mani

const upload = multer()

//User
app.post('/api/register', checkSchema(userRegisterSchema), userCltr.register)
app.post('/api/login',checkSchema(userLoginSchema), userCltr.login)
app.get('/api/account', authenticateUser,userCltr.account)
app.get('/api/allaccounts', authenticateUser, permitUser('admin') ,userCltr.allAccounts)
app.delete('/api/deleteuser/:uId', authenticateUser, permitUser('admin') ,userCltr.deleteuser)
//Product
app.post('/api/product/add', authenticateUser, upload.array('productImage') ,productCltr.add)
app.get('/api/product/list', authenticateUser, productCltr.list)
app.get('/api/product/listAll',authenticateUser, productCltr.listAll )
app.get('/api/product/listQuery',authenticateUser, productCltr.listQuery )
app.put('/api/product/update/:pId', authenticateUser, productCltr.update)
app.put('/api/product/updateStock/:pId', authenticateUser, productCltr.updateStock)
app.put('/api/product/updateStockAvlb/:pId', authenticateUser, productCltr.makeAvailable)
app.delete('/api/product/delete/:pId', authenticateUser, permitUser(["admin",'user']) ,productCltr.delete)
//Address
app.post('/api/address/add',  authenticateUser,checkSchema(addressValidationSchema), addressCltr.add)
app.get('/api/address/list',authenticateUser, addressCltr.address)
app.get('/api/address/all', authenticateUser, addressCltr.allAddress)
app.put('/api/address/update/:aId', authenticateUser,  addressCltr.update)

//Review
app.post('/api/comment/add/:pId', authenticateUser, checkSchema(reviewValidationSchema), reviewCltr.add)
app.put('/api/product/:pId/comment/edit/:rId', authenticateUser, reviewCltr.edit)
app.delete('/api/product/:pId/comment/delete/:rId', authenticateUser, permitUser(['admin','user']), reviewCltr.delete)
//category
app.post('/api/category', authenticateUser,checkSchema(categoryValidationSchema),permitUser('admin'), categoryCltr.add)
app.get('/api/category/list', authenticateUser, categoryCltr.list)
app.delete('/api/category/delete/:cId', authenticateUser, permitUser('admin'), categoryCltr.delete )
//RentalProduct 
app.post('/api/rentaProduct/add/:pId' , authenticateUser, upload.array('aadhar'), rentalProductCltr.add )
app.get('/api/rentaProduct/list' , authenticateUser, rentalProductCltr.list )
app.get('/api/rentalProduct/all',authenticateUser, rentalProductCltr.all)//no
app.get('/api/rentalProduct/requests',authenticateUser, rentalProductCltr.requests)
app.put('/api/requests/accept/:aId',authenticateUser, rentalProductCltr.accept)
app.put('/api/requests/payCompleted/:aId',authenticateUser, rentalProductCltr.payCompleted)
//payment
app.post('/api/payment/create',authenticateUser, permitUser(['user','admin']),paymentCltr.create)
app.put('/api/payment/update/:id',authenticateUser, permitUser(['user','admin']), paymentCltr.update)
app.delete('/api/payment/delete/:id',authenticateUser, permitUser(['user','admin']),paymentCltr.delete)
app.get('/api/payment/userList',authenticateUser,permitUser(['user','admin']),paymentCltr.userList)


app.listen(port, ()=>{
    console.log('server running on port', port)
})
