const mongoose =require('mongoose')

const adoptionuserSchema =new mongoose.Schema({
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
const adoptionusers =mongoose.model("adoptionusers",adoptionuserSchema)
module.exports =adoptionusers