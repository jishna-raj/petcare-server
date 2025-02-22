const mongoose =require('mongoose')


const bookingSchema=new mongoose.Schema({

   service:{
    required:true,
    type:String
    
   },
    petsCount:{
        required:true,
        type:Number
    },
    petType:{
        required:true,
        type:String
    },
    breed:{
        type:String
    },
    petSize:{
        required:true,
        type:String
    },
    instruction:{
        type:String
    },
    pickup:{
        type:String
    },
    date:{
        required:true,
        type:String
    },
    userId:{
        required:true,
        type:String
    }
})
const booking =mongoose.model("booking",bookingSchema)
module.exports =booking
