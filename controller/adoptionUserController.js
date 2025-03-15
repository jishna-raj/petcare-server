const adoptionusers =require('../model/adoptionusermodel')

const jwt =require('jsonwebtoken')


//register

exports.adoptionregisterController =async(req,res)=>{
console.log('inside the register controller');

const {username , email ,password}=req.body
console.log(username , email ,password);

try {
    const existingUser =await adoptionusers.findOne({email})
    if (existingUser) {
        res.status(406).json('Account already exist')
    } else {
        const newAdoptionUser =new adoptionusers({
            username,
            email,
            password,
            place:"",
            mobile:"",
            img:""
        })
        await newAdoptionUser.save()
        res.status(200).json(newAdoptionUser)
    }
} catch (error) {
    res.status(401).json(error)
}


}
//login

exports.adoptionloginController =async(req,res)=>{
    const{email , password}=req.body
    console.log(email,password);
    
    try {
        const existingUser=await adoptionusers.findOne({email,password})
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


exports.getallAdoptionUserController=async(req,res)=>{

    try {
        // Get all users from database
        const users = await adoptionusers.find({}).select('-password');
        
        res.status(200).json({
            success: true,
            users,
            count: users.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
}

exports.getadoptionuserController =async(req,res)=>{
    const userId =req.payload
    console.log(userId);
    
    try {
        const userDetails=await adoptionusers.findOne({_id:userId})
        console.log(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}
//edit profile

exports.editadoptionprofileController=async(req,res)=>{

    console.log('inside user edit controller');
    

    const userId =req.payload
 console.log('userid',req.file);
 
    
    const{username , email ,password,place,mobile,img}=req.body
    console.log(req.body);
    const profileImg = req.file?req.file.filename:img

    console.log(profileImg);
    
    try {
      const existingUser =await adoptionusers.findByIdAndUpdate({_id:userId},
      {username,email,password,place,mobile,img:profileImg},{new:true})
      await existingUser.save()
      res.status(200).json(existingUser)
      
    } catch (error) {
      res.status(401).json(error)
      
    }
}

//get booking userDetails

exports.getbookingadoptionuserController =async(req,res)=>{
    const userId =req.params.id
    console.log(userId);
    
    try {
        const userDetails=await adoptionusers.findOne({_id:userId})
        console.log(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}



exports.getadoptionuserIdController =async(req,res)=>{
    const userId =req.params.id
    console.log(userId);
    
    try {
        const userDetails=await adoptionusers.findOne({_id:userId})
        console.log(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}


