
const booking = require('../model/bookingModel');



//booking request

exports.bookingDetailsController = async (req, res) => {
  console.log('bookingggggggggggggggggg');

  const userId = req.payload;

  console.log(req.body);


  try {
    // Validate required fields with nested paths
    const requiredFields = [
      ['service'],
      ['serviceDetails', 'petsCount'],
      ['serviceDetails', 'petType'],
      ['serviceDetails', 'petSize'],
      ['schedule', 'date'],
      ['location'],
      ['workerId'],
      [ 'amount'],
      ['serviceDetails','instruction'] 
    ];

    const missingFields = requiredFields.filter(path => {
      const value = path.reduce((obj, key) => obj?.[key], req.body);
      console.log(`Checking field ${path.join('.')}:`, value);
      return value === undefined || value === null;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.map(path => path.join('.')).join(', ')}`
      });
    }

    // Create booking with nested fields including payment
    const newBooking = new booking({
      userId,
      workerId: req.body.workerId,
      service: req.body.service,
      serviceDetails: {
        petsCount: req.body.serviceDetails.petsCount,
        petType: req.body.serviceDetails.petType,
        breed: req.body.serviceDetails.breed || undefined,
        petSize: req.body.serviceDetails.petSize,
        instructions: req.body.serviceDetails.instruction || undefined,
      },
      schedule: {
        date: req.body.schedule.date,
        timeSlot: req.body.schedule.timeSlot || undefined
      },
      location: req.body.location,
      
      status: 'Pending',

      amount: req.body.amount,
      paymentStatus: req.body.paymentStatus,

    });

    await newBooking.save();

    res.status(201).json({
      status: 'success',
      data: newBooking
    });

  } catch (error) {
    console.error("Error details:", error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

//get all userbooking

exports.getuserBookingController = async (req, res) => {
  try {
    const allBookings = await booking.find()
      .populate('userId', 'name email')
      .populate('workerId', 'name service');

    res.status(200).json({
      status: 'success',
      results: allBookings.length,
      data: allBookings
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

//get all booking

exports.getAUserAllbookingController = async (req, res) => {
  try {
    // Get user ID from request parameters (more RESTful than body for GET requests)
    const { id } = req.params;

    console.log(id);
    

    // Find bookings with proper error handling
    const bookings = await booking.find({ userId:id })
      .populate({
        path: 'workerId',
        select: 'name email phone profilePicture',
        model: 'employee' // Explicitly specify the model
      })
      .sort('-createdAt')
      .lean(); // Convert to plain JS objects for better manipulation

    // Handle no bookings found scenario
    if (!bookings.length) {
      return res.status(200).json({
        status: 'success',
        message: 'No bookings found',
        data: []
      });
    }

    // Format response data
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      service: booking.service,
      status: booking.status,
      schedule: {
        date: booking.schedule.date.toISOString(),
        timeSlot: booking.schedule.timeSlot
      },
      location: booking.location,
      payment: {
        amount: booking.amount,
        status: booking.paymentStatus
      },
      worker: booking.workerId ? {
        id: booking.workerId._id,
        name: booking.workerId.name,
        contact: {
          email: booking.workerId.email,
          phone: booking.workerId.phone
        },
        
      } : null,
      pets: {
        type: booking.serviceDetails.petType,
        breed: booking.serviceDetails.breed,
        size: booking.serviceDetails.petSize,
        count: booking.serviceDetails.petsCount,
        instructions: booking.serviceDetails.instructions
      },
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt?.toISOString() || null
    }));

    res.status(200).json({
      status: 'success',
      results: formattedBookings.length,
      data: formattedBookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


exports.updatebookingStatusController = async (req, res) => {

  try {
    // Check for valid JSON body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty request body'
      });
    }

    // Use req.params.id to match the route parameter
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: booking ID and status'
      });
    }

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update booking status
    const updatedBooking = await booking.findByIdAndUpdate(
      id, // Use the id from params
      {
        $set: {
          status: status,
          updatedAt: new Date()
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('workerId', 'name email phone');

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        bookingId: updatedBooking._id,
        status: updatedBooking.status,
        worker: updatedBooking.workerId,
        service: updatedBooking.service,
        date: updatedBooking.schedule.date
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);

    let errorMessage = 'Failed to update booking status';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid booking ID format';
    } else if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }


}