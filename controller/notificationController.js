
const message =require('../model/messages.Model')


const booking = require('../model/bookingModel'); // Import your Booking model

exports.messageController = async (req, res) => {
    try {
        const { bookingId, workerId, content, senderType } = req.body;

        // Validate required fields
        if (!bookingId || !workerId || !content || !senderType) {
            return res.status(400).json({ 
                error: "Missing required fields",
                required: ["bookingId", "workerId", "content", "senderType"]
            });
        }

        // Correct findById usage (no object wrapper)
        const bookings = await booking.findById(bookingId).exec();

        if (!bookings) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Create new message with correct model reference and user ID
        const newMessage = new message({
            bookingId,
            workerId,
            content,
            senderType,
            userId: bookings.userId, // Directly use the ObjectId from booking
            relatedService: req.body.relatedService,
            statusUpdate: req.body.statusUpdate
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message created successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Message creation error:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => ({
                field: el.path,
                message: el.message
            }));
            return res.status(400).json({ 
                error: "Validation failed",
                details: errors 
            });
        }

        // Handle CastError (invalid ID format)
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                error: "Invalid ID format",
                path: error.path
            });
        }

        res.status(500).json({ 
            error: "Server error",
            message: error.message 
        });
    }
};
 //get message

exports.getMessageController =async(req,res)=>{
    const userIds =req.params

    const userrId = userIds.id
    /* console.log(userIds.id); */
    
    try {
        
        const userMessage=await message.find({userId:userrId})
        
        res.status(200).json(userMessage)
    } catch (error) {
        res.status(401).json(error)
    }

}



exports.deleteNotificationController = async (req, res) => {
    try {
      const { id} = req.params;
/*       console.log(id); */
      
  
      
      // Find and delete the message
      const deletedMessage = await message.findByIdAndDelete({_id:id});
  
      if (!deletedMessage) {
        return res.status(404).json({
          status: 'fail',
          message: 'Message not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Message deleted successfully',
        data: null
      });
  
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  };



