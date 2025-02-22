const mongoose =require('mongoose')

const userSchema =new mongoose.Schema({
    username:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    place:{
        
        type:String
    },
    mobile:{
        
        type:String
    },
    img:{
        
        type:String
    }
})
const users =mongoose.model("users",userSchema)
module.exports =users