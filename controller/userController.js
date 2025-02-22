
const users =require('../model/userModel')

const jwt =require('jsonwebtoken')


//register

exports.registerController =async(req,res)=>{
console.log('inside the register controller');

const {username , email ,password}=req.body
console.log(username , email ,password);

try {
    const existingUser =await users.findOne({email})
    if (existingUser) {
        res.status(406).json('Account already exist')
    } else {
        const newUser =new users({
            username,
            email,
            password,
            place:"",
            mobile:"",
            img:""
        })
        await newUser.save()
        res.status(200).json(newUser)
    }
} catch (error) {
    res.status(401).json(error)
}


}
//login

exports.loginController =async(req,res)=>{
    const{email , password}=req.body
    console.log(email,password);
    
    try {
        const existingUser=await users.findOne({email,password})
        if (existingUser) {
            const token =jwt.sign({userId:existingUser._id},"supersecretkey")
            res.status(200).json({existingUser,token})
        } else {
            res.status(406).json('Account doesnot exist')
        }
        
    } catch (error) {
       res.status(401).json(error) 
    }
}

//get user details

exports.getuserController =async(req,res)=>{
    const userId =req.payload
    try {
        const userDetails=await users.findOne({_id:userId})
        console.log(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}
//edit profile

exports.editprofileController=async(req,res)=>{

    const userId =req.payload
 console.log('userid',req.file);
 
    
    const{username , email ,password,place,mobile,img}=req.body
    console.log(req.body);
    const profileImg = req.file?req.file.filename:img

    console.log(profileImg);
    
    try {
      const existingUser =await users.findByIdAndUpdate({_id:userId},
      {username,email,password,place,mobile,img:profileImg},{new:true})
      await existingUser.save()
      res.status(200).json(existingUser)
      
    } catch (error) {
      res.status(401).json(error)
      
    }
}

//get booking userDetails

exports.getbookinguserController =async(req,res)=>{
    const userId =req.params.id
    console.log(userId);
    
    try {
        const userDetails=await users.findOne({_id:userId})
        console.log(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}


