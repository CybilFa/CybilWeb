const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
    firstname : String,
    lastname : String,
    phone : String,
    email : String,
    password : String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] ,
     role: {
    type: String,
    default: 'user', // 'admin' or 'user'
  },
   

})


const user =  mongoose.model ('User' , userSchema)
module.exports = user 