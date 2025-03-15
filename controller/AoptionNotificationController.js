const AdoptionNotification = require('../model/adoptionmessagemodel')


exports.addAdoptionNotification  = async(req,res) =>{

    try {
        const { user, adoptionRequest, pet, message, type } = req.body;

        // Validate required fields
        const requiredFields = ['user', 'adoptionRequest', 'pet'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        
        const newNotification = new AdoptionNotification({
            user,
            adoptionRequest,
            pet,
            type: type || 'adoption_approved',
            message: message || `Your adoption request has been approved!`,
            url: `/adoptions/${adoptionRequest}`
        });

        const savedNotification = await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: savedNotification
        });

    } catch (error) {
        console.error("Error creating notification:", error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Notification already exists"
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(val => val.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }

}