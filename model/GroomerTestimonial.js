const mongoose = require('mongoose')


const testimonialSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    img:{
        type: String
       
        
    },
    review: {
        type: String,
        required: true,
        maxlength: 500, // Limit to 500 characters
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
});


const GroomerTestimonials = mongoose.model('GroomerTestimonials', testimonialSchema)

module.exports = GroomerTestimonials ;