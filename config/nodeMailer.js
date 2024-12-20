require('dotenv').config()
const nodemailer = require('nodemailer')
const user = process.env.NODE_MAILER_MAIL
const pass = process.env.NODE_MAILER_PASS

console.log(pass, user, "123")

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: user,
      pass: pass
   },
   tls: {
      rejectUnauthorized: false // ignore self-signed certificate
  }
})

// Check for initialisation status
transporter.verify((err, success)=>{
   if(err){
     console.log("Nodemailer initialisation : ", err.message)
   } else{
     console.log("Nodemailer is ready for messages")
   }
 })

module.exports = transporter