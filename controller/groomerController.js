const groomers = require('../model/employeeModel')
const booking =require('../model/bookingModel');



const jwt = require("jsonwebtoken")



exports.groomerRegisterController = async(req,res)=>{


    try {
        const {
          name,
          email,
          password,
          services,
          phone,
          address,
          experience,
          certification,
          license,
          bio,
        } = req.body;
    
        // Handle file upload for profilePicture
        const profilePicture = req.file ? req.file.filename : null; // Use req.file for uploaded files
    
        console.log({
          name,
          email,
          password,
          services,
          phone,
          address,
          experience,
          certification,
          license,
          profilePicture,
          bio,
        });
    
        // Check if the email is already registered
        const existingGroomer = await groomers.findOne({ email });
        if (existingGroomer) {
          return res.status(400).json({ message: 'Email already registered' });
        }
    
        // Create a new groomer (employee)
        const newGroomer = new groomers({
          name,
          email,
          password, // Note: In a real app, hash the password before saving
          services,
          phone,
          address,
          experience,
          certification: certification.split(',').map((cert) => cert.trim()),
          license, 
          bio,
          profilePicture, // Use the filename from the uploaded file
        });
    
        // Save the groomer to the database
        await newGroomer.save();
    
        // Respond with success message
        res.status(201).json({ message: 'Groomer registered successfully', groomer: newGroomer });
      } catch (error) {
        console.error('Error registering groomer:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

    
}



exports.groomerloginController = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        // Search for groomer in the groomers collection
        const existingGroomer = await groomers.findOne({ email, password });

        console.log(existingGroomer);
        

        if (existingGroomer) {
            // Check if the groomer's status is 'accepted'
            if (existingGroomer.status === 'accepted') {
                // Create JWT token
                const token = jwt.sign({ groomerId: existingGroomer._id }, "supersecretkey");
                res.status(200).json({ existingGroomer, token });
            } else {
                res.status(403).json('Your account is not yet accepted by the admin.');
            }
        } else {
            res.status(406).json('Invalid credentials or account does not exist');
        }
        
    } catch (error) {
        res.status(401).json(error);
    }
}






exports.getAllGroomersController = async(req,res)=>{



    try {
        // Fetch all groomers from the database
        const allgroomers = await groomers.find();

        // Respond with the groomers' data
        res.status(200).json(allgroomers);
    } catch (error) {
        console.error('Error fetching groomers:', error);
        res.status(500).json({ message: 'Failed to fetch groomers' });
    }
}

exports.getAGroomerController = async(req,res)=>{


    try {
        const { id } = req.params; // Get the groomer ID from the request parameters

        // Find the groomer by ID
        const Agroomer = await groomers.findById(id);

        // If groomer not found, return a 404 error
        if (!Agroomer) {
            return res.status(404).json({ message: 'Groomer not found' });
        }

        // Respond with the groomer's data
        res.status(200).json(Agroomer);
    } catch (error) {
        console.error('Error fetching groomer:', error);
        res.status(500).json({ message: 'Failed to fetch groomer' });
    }
    
}


exports.groomerStatus = async(req,res)=>{



    try {
        const { id } = req.params; // Extract the groomer ID from the request parameters
        const { status } = req.body; // Extract the new status from the request body

        // Validate the status
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find the groomer by ID and update their status
        const updatedGroomer = await groomers.findByIdAndUpdate(
            id,
            { status }, // Update the status field
            { new: true } // Return the updated document
        );

        // If groomer not found, return a 404 error
        if (!updatedGroomer) {
            return res.status(404).json({ message: 'Groomer not found' });
        }

        // Respond with the updated groomer
        res.status(200).json({ message: 'Status updated successfully', groomer: updatedGroomer });
    } catch (error) {
        console.error('Error updating groomer status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }


}


exports.getGroomerByserviceController = async(req,res)=>{

    try {
        const { service } = req.query; // Assuming the service is passed as a query parameter

        if (!service) {
            return res.status(400).json({ message: 'Service query parameter is required' });
        }

        const workers = await groomers.find({ services: service });

        if (workers.length === 0) {
            return res.status(404).json({ message: 'No workers found for the specified service' });
        }

        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}



exports.getgroomerBookingController=async(req,res)=>{

    try {
        const { id } = req.params; 


        // Check if the groomer exists and is accepted
        const groomer = await groomers.findById(id);
        if (!groomer) {
            return res.status(404).json({ 
                success: false,
                message: 'Groomer not found' 
            });
        }

        if (groomer.status !== 'accepted') {
            return res.status(403).json({ 
                success: false,
                message: 'Groomer account is not active' 
            });
        }

        // Get all bookings for this groomer
        const bookings = await booking.find({ workerId: id })
            .populate('userId', 'username email mobile place') // Populate user details
            .sort({ 'schedule.date': 1, 'schedule.timeSlot.start': 1 }); // Sort by date and time

            console.log(bookings);
            

        // Format the response data
        const formattedBookings = bookings.map(booking => ({
            _id: booking._id,
            service: booking.service,
            petDetails: {
                type: booking.serviceDetails.petType,
                breed: booking.serviceDetails.breed,
                size: booking.serviceDetails.petSize,
                count: booking.serviceDetails.petsCount,
              instructions: booking.serviceDetails.instructions
            },
            amount:booking.amount,
            paymentStatus:booking.paymentStatus,
            schedule: {
                date: booking.schedule.date,
                timeSlot: booking.schedule.timeSlot,
                location: booking.location
            },
            status: booking.status,
            customer: {
                userId:booking.userId,
                name: booking.userId.username,
                email: booking.userId.email,
                phone: booking.userId.mobile,
                place:booking.userId.place
            },
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }));

        console.log(formattedBookings);
        

        res.status(200).json({
            success: true,
            count: formattedBookings.length,
            data: formattedBookings
        });

    } catch (error) {
        console.error('Error fetching groomer bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings',
            error: error.message
        });
    }
}



exports.updateGroomerController = async(req,res)=>{


    try {
        const { id } = req.params;
        const { certification, license, availability } = req.body;

        // Basic validation
        if (!license) {
            return res.status(400).json({
                success: false,
                message: 'License is required'
            });
        }

        // Enhanced validation
        const validationErrors = [];
        
        if (certification && !Array.isArray(certification)) {
            validationErrors.push('Certifications must be an array');
        }

        if (availability) {
            if (!Array.isArray(availability)) {
                validationErrors.push('Availability must be an array');
            } else {
                availability.forEach((day, index) => {
                    if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day.day)) {
                        validationErrors.push(`Invalid day at index ${index}`);
                    }
                    
                    if (!Array.isArray(day.slots)) {
                        validationErrors.push(`Slots must be an array for day ${day.day}`);
                    } else {
                        day.slots.forEach((slot, slotIndex) => {
                            if (!slot.start || !slot.end) {
                                validationErrors.push(`Missing time in slot ${slotIndex} for ${day.day}`);
                            }
                            if (!['available', 'booked'].includes(slot.status)) {
                                validationErrors.push(`Invalid status in slot ${slotIndex} for ${day.day}`);
                            }
                        });
                    }
                });
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: validationErrors
            });
        }

        // Proper update with atomic operations
        const updatePayload = {
            certification,
            license,
            availability
        };

        const updatedGroomer = await groomers.findByIdAndUpdate(
            id,
            { $set: updatePayload },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        ).lean();

        if (!updatedGroomer) {
            return res.status(404).json({
                success: false,
                message: 'Groomer not found'
            });
        }

        // Format response
        const responseData = {
            _id: updatedGroomer._id,
            certification: updatedGroomer.certification,
            license: updatedGroomer.license,
            availability: updatedGroomer.availability.map(day => ({
                day: day.day,
                slots: day.slots.map(slot => ({
                    start: slot.start,
                    end: slot.end,
                    status: slot.status
                }))
            }))
        };

        res.status(200).json({
            success: true,
            message: 'Groomer updated successfully',
            data: responseData
        });

    } catch (error) {
        console.error('Error updating groomer:', error);
        
        // Handle specific MongoDB errors
        let errorMessage = 'Server error while updating groomer';
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate field value entered';
        }

    }


}

