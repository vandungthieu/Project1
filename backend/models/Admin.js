const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    name : {type: String, required : true},
    password : {type: String , required : true},
    pin : {type: String, required: true}
})

module.exports = mongoose.model('Admin', adminSchema)