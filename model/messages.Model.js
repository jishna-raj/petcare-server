const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: [true, 'Message must be associated with a booking']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Message must belong to a user']
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: [true, 'Message must be associated with a worker']
  },
  content: {
    type: String,
    required: [true, 'Message content is required']
  },
  senderType: {
    type: String,
    enum: ['user', 'worker'],
    required: [true, 'Sender type must be specified']
  },
  relatedService: {
    type: String,
    enum: [
      'Pet Taxi',
      'Pet Grooming',
      'Pet Training',
      'Pet Sitting',
      'Pet Daycare',
      'Pet Walking'
    ]
  },
  statusUpdate: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;