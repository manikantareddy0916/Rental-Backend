const mongoose = require ('mongoose')
const configureDB = async()=>{
    console.log('1')
    try{
        const url = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
        const dbName = process.env.DB_NAME || 'myrental'
        console.log('2',url,dbName)
        const db = await mongoose.connect(`${url}/${dbName}`)
        console.log('connected to db')
    }
    catch(e){
        console.log('error connecting to DB')
    }
}

module.exports = configureDB