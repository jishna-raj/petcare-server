
const message =require('../model/messages.Model')




exports.messageController =async(req,res)=>{
   
    const {userId,service,date}=req.body
    // console.log('message',req.body);
    
    try {
     const newMessage =new message({
        service,
        date,
        userId
     })
     await newMessage.save()
     res.status(200).json(newMessage)
        
    } catch (error) {
        res.status(406).json(error)
    }
 }

 //get message

 exports.getMessageController =async(req,res)=>{
    const userId =req.payload
    
    try {
        
        const userMessage=await message.find({userId})
        console.log(userId);
        res.status(200).json(userMessage)
    } catch (error) {
        res.status(401).json(error)
    }

}



