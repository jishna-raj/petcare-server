const groomerTestimonial = require('../model/GroomerTestimonial')  


exports.addGroomerTestimonialController = async (req, res) => {
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
        const newTestimonial = new groomerTestimonial({
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



exports.getallGroomerTestimonialController = async(req,res)=>{

     try {
            // Fetch all testimonials
            const allTestimonials = await groomerTestimonial.find().sort({ postedAt: -1 });
    
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
}


exports.getHomeTestimonialController = async(req,res)=>{

    try {
        // Fetch 4 most recent testimonials, sorted by postedAt in descending order
        const testimonials = await groomerTestimonial.find()
            .sort({ postedAt: -1 }) // Sort by newest first
            .limit(4); // Limit to 4 results

        if (!testimonials || testimonials.length === 0) {
            return res.status(404).json({
                status: 'success',
                message: 'No testimonials found',
                data: []
            });
        }

        res.status(200).json({
            status: 'success',
            results: testimonials.length,
            data: testimonials
        });

    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch testimonials',
            error: error.message
        });
    }
}