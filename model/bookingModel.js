const mongoose = require('mongoose')


const bookingSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Booking must belong to a user']
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employee',
      required: [true, 'Booking must be assigned to a worker']
    },
    service: {
      type: String,
      required: [true, 'Please select a service'],
      enum: [
        'Pet Taxi',
        'Pet Grooming',
        'Pet Training',
        'Pet Sitting',
        'Pet Daycare',
        'Pet Walking'
      ]
    },

    serviceDetails: {
      petsCount: {
        type: Number,
        required: [true, 'Please specify number of pets'],
        min: [1, 'At least 1 pet required']
      },
      petType: {
        type: String,
        required: [true, 'Please specify pet type'],
        enum: ['Dog', 'Cat']
      },
      breed: String,
      petSize: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Giant'],
        required: [true, 'Please specify pet size']
      },
       instructions:{
        type:String
      } 
    },
    schedule: {
      date: {
        type: Date,
        required: [true, 'Booking date is required']
      },
      timeSlot: {
        start: String,
        end: String
      }
    },
    location: {
      type: String,
      enum: ['Pickup', 'At Home'],
      required: [true, 'Location type required']
    },
   
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
   
      amount: {
          type: Number,
          required: [true, 'Payment amount is required'],
          min: [0, 'Amount cannot be negative']
    
  },
  paymentStatus:{
type:String
  },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  });

const booking = mongoose.model("booking", bookingSchema)
module.exports = booking
