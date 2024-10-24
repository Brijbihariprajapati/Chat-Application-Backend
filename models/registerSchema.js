const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const registeruser = mongoose.model('registeruser', schema)
module.exports = registeruser;