// models/adoptionRequest.model.js
const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  // Reference to the pet being adopted
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  
  // Reference to the user submitting the request
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Form fields
  adoptionReason: {
    type: String,
    required: [true, 'Adoption reason is required'],
    trim: true
  },
  previousExperience: {
    type: String,
    trim: true
  },
  
  // Request status tracking
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Automatic timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster querying
adoptionRequestSchema.index({ pet: 1, user: 1 }, { unique: true }); // Prevent duplicate requests
adoptionRequestSchema.index({ status: 1 });

// Update the updatedAt timestamp on save
adoptionRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AdoptionRequests = mongoose.model('AdoptionRequests', adoptionRequestSchema);

module.exports = AdoptionRequests;