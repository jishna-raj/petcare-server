const AdoptionRequest = require('../model/adoptionrequestmodel');
const pets  = require('../model/petModel');
const adoptionusers = require('../model/adoptionusermodel');
const mongoose = require('mongoose');

exports.addAdoptionRequest = async (req, res) => {
    try {
        const { petId, adoptionReason, previousExperience,userId } = req.body
       
        
        

        // Validate required fields
        if (!petId || !adoptionReason) {
            return res.status(400).json({
                success: false,
                message: "Pet ID and adoption reason are required fields."
            });
        }

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Pet ID format."
            });
        }

        // Check if pet exists
        const pet = await pets.findById(petId);
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found."
            });
        }

        // Check if user exists
        const user = await adoptionusers.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check for existing pending request
        const existingRequest = await AdoptionRequest.findOne({
            pet: petId,
            user: userId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending request for this pet."
            });
        }

        // Create new adoption request
        const newRequest = new AdoptionRequest({
            pet: petId,
            user: userId,
            adoptionReason,
            previousExperience: previousExperience || '',
            status: 'pending'
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            success: true,
            message: "Adoption request submitted successfully!",
            data: {
                _id: savedRequest._id,
                pet: pet.name,
                user: user.username,
                status: savedRequest.status,
                submittedAt: savedRequest.submittedAt
            }
        });

    } catch (error) {
        console.error("Error creating adoption request:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



exports.getAllAdoptionRequests = async (req, res) => {
    try {
      

        const requests = await AdoptionRequest.find()
            .populate({
                path: 'pet',
                select: 'name petType breed petimg'
            })
            .populate({
                path: 'user',
                select: 'username email'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All adoption requests retrieved successfully",
            data: requests
        });

    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.updateRequestController = async(req,res) =>{


    try {
        const { id } = req.params;
        const { status } = req.body;

       
      
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value. Allowed values: pending, approved, rejected"
            });
        }

        // Find and update the request
        const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
        .populate('pet', 'name petType breed')
        .populate('user', 'username email');

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: "Adoption request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Adoption request updated successfully",
            data: {
                _id: updatedRequest._id,
                status: updatedRequest.status,
                pet: updatedRequest.pet,
                user: updatedRequest.user,
                updatedAt: updatedRequest.updatedAt
            }
        });

    } catch (error) {
        console.error("Error updating adoption request:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}



exports.getUserAdoptionRequestController = async(req,res)=>{


    try {
        const userId = req.params.id || req.user?._id;
        console.log(req.params);
        
        
        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const userExists = await adoptionusers.exists({_id:userId});
        if (!userExists) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        // Get adoption requests with populated pet details
        const requests = await AdoptionRequest.find({ user: userId })
            .populate({
                path: 'pet',
                select: 'name breed age status images' // Only essential pet fields
            })
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            status: 'success',
            results: requests.length,
            data: {
                requests
            }
        });

    } catch (error) {
        console.error('Error fetching adoption requests:', error);
        
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid user ID format'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch adoption requests',
            error: error.message
        });
    }

}