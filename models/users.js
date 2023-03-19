const mongoose = require('mongoose')
const user = mongoose.model('user',{
name: String,
email: String,
passaword: String,
}

)
module.exports = user;