const mongoose =require('mongoose')

const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
     
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    services: {
      type: [String],
      required: true,
      enum: [
        'Pet Taxi',
        'Pet Grooming',
        'Pet Training',
        'Pet Sitting',
        'Pet Daycare',
        'Pet Walking'
      ],
      },
    phone: {
      type: String,
      required: [true, 'Please enter your phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please enter your address'],
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0
    },
    certification: {
      type: [String],
      default: []
    },
    license:{
      type:String,
      required:true
    },
    availability: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      slots: [{
        start: String,
        end: String,
        status: {
          type: String,
          enum: ['available', 'booked'],
          default: 'available'
        }
      }]
    }],
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    },
    status:{
      type:String,
      enum:["pending","accepted","rejected"],
      default:"pending"

    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
const employee =mongoose.model("employee",employeeSchema)
module.exports =employee