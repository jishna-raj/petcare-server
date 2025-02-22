const booking =require('../model/bookingModel');



//booking request

 exports.bookingDetailsController =async(req,res)=>{
   
    const {service,petsCount , petType , breed ,petSize ,instruction ,pickup ,date}=req.body
    
    console.log(req.body);
    
  const userId=req.payload
    try {
     const newBookig =new booking({
        service,
        petsCount,
        petType,
        breed,
        petSize,
        instruction,
        pickup,
        date,
        userId
     })
     await newBookig.save()
     res.status(200).json(newBookig)
        
    } catch (error) {
        res.status(406).json(error)
    }
 }

 //get userbooking

 exports.getuserBookingController =async(req,res)=>{
    const userId =req.payload
    
    try {
        
        
        const userBookingDetails=await booking.find({userId})
        console.log(userId);
        res.status(200).json(userBookingDetails)
    } catch (error) {
        res.status(401).json(error)
    }

}

//get all booking

exports.getAllbookingController =async(req,res)=>{
    try {
        const allBooking =await booking.find()
        res.status(200).json(allBooking)
    } catch (error) {
        res.status(401).json(error)
    }
}
