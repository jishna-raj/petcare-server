const mongoose =require('mongoose')

const messageSchema=new mongoose.Schema({
   
    userId:{
        required:true,
        type:String
    },
    service:{
        required:true,
        type:String
    },
    date:{
        required:true,
        type:String
    }
})


const message =mongoose.model("message",messageSchema)
module.exports=message