const mongoose = require('mongoose')

const adoptionNotificationSchema = new mongoose.Schema({
    // Reference to the user receiving the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    
    // Reference to the adoption request
    adoptionRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdoptionRequest',
      required: [true, 'Adoption request reference is required']
    },
    
    // Notification type (for potential future expansion)
    type: {
      type: String,
      enum: ['adoption_approved', 'adoption_rejected', 'status_update'],
      default: 'adoption_approved'
    },
    
    // Notification message content
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      default: 'Your adoption request has been approved!'
    },
    
    // Reference to the pet being adopted
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet reference is required']
    },
    
    // Read status tracking
    read: {
      type: Boolean,
      default: false
    },
    
  }, {
    timestamps: true,  // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  
  // Indexes for faster querying
  adoptionNotificationSchema.index({ user: 1, read: 1 });
  adoptionNotificationSchema.index({ createdAt: -1 });
  
  // Virtual population (if needed)
  adoptionNotificationSchema.virtual('formattedDate').get(function() {
    return moment(this.createdAt).format('MMM Do YYYY, h:mm a');
  });
  
  const AdoptionNotification = mongoose.model('AdoptionNotification', adoptionNotificationSchema);

  module.exports = AdoptionNotification