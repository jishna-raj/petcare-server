const mongoose = require('mongoose')


const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adoptionusers', 
        required: true,
    },
    review: {
        type: String,
        required: true,
        maxlength: 500, // Limit to 500 characters
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adoptionusers', 
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);