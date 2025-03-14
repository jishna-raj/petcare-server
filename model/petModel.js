const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ageYears: {
    type: Number,
    min: 0,
    required: true
  },
  ageMonths: {
    type: Number,
    min: 0,
    max: 11,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    enum: ['Dog', 'Cat'],
    required: true
  },
  breed: String,
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', '']
  },
  coatType: {
    type: String,
    enum: ['Short', 'Medium', 'Long', 'Hairless', '']
  },
  vaccines: [{
    type: String,
    enum: ['rabies', 'distemper', 'parvovirus', 'leptospirosis']
  }],
  medicationInfo: String,
  healthNotes: String,
  justification: String,
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'pending'
  },
  petimg: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'adoptionusers', // Make sure this matches your User model name
    required: true
  }
}, {
  timestamps: true
});

const pets = mongoose.model('Pet', petSchema);

module.exports = pets;