const testimonials = require('../model/testimonialmodel');

exports.addTestimonialController = async (req, res) => {
    try {
        // Extract data from request body
        const { user, img, review } = req.body;

        // Validate required fields
        if (!user || !review) {
            return res.status(400).json({
                success: false,
                message: "User and review fields are required.",
            });
        }

        // Validate review length
        if (review.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Review cannot exceed 500 characters.",
            });
        }

        // Create new testimonial document
        const newTestimonial = new testimonials({
            user,
            img: img || '', // Handle optional image field
            review,
        });

        // Save to database
        const savedTestimonial = await newTestimonial.save();

        // Return success response
        res.status(201).json({
            success: true,
            message: "Testimonial added successfully.",
            data: savedTestimonial,
        });
    } catch (error) {
        console.error("Error adding testimonial:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};

exports.getTestimonialController = async (req, res) => {
    try {
        // Fetch all testimonials
        const allTestimonials = await testimonials.find().sort({ postedAt: -1 });

        // Return even if empty array
        res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully.",
            data: allTestimonials,
        });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};