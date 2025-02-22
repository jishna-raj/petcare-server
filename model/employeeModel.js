const mongoose =require('mongoose')

const employeeSchema =new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    mobile:{
        required:true,
        type:String
    },
    license:{
        required:true,
        type:String
    },
    place:{
        
        type:String
    },
    designation:{
        
        type:String
    },
    img:{
        
        type:String
    },
    userId:{
        required:true,
        type:String
    }
})
const employee =mongoose.model("employee",employeeSchema)
module.exports =employee