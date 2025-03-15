const pets = require('../model/petModel')

exports.addPetController = async (req, res) => {



  try {
    // Extract required fields from request body
    const {
      name,
      ageYears,
      ageMonths,
      location,
      petType,
      breed,
      gender,
      size,
      coatType,
      vaccines,
      medicationInfo,
      healthNotes,
      justification,
      contactEmail,
      contactPhone
    } = req.body;


    const petimg = req.file.filename

    console.log(req);


    // Validate required fields
    if (!name || !petType || !gender || !req.body.userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, petType, gender, or user authentication'
      });
    }

    // Create new pet object
    const newPet = new pets({
      name,
      ageYears: ageYears || 0,
      ageMonths: ageMonths || 0,
      location,
      petType,
      breed,
      gender,
      size,
      coatType,
      vaccines: vaccines || [],
      medicationInfo,
      healthNotes,
      petimg,
      justification,
      contactEmail,
      contactPhone,
      createdBy: req.body.userId // Assuming user is authenticated and attached to req.user
    });

    // Save to database
    const savedPet = await newPet.save();

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      pet: savedPet
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle duplicate key errors (if any)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Pet with this name already exists'
      });
    }

    // General error handling
    console.error('Error adding pet:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }

}


exports.getAllPetsController = async (req, res) => {


  try {
    // Fetch all pets from the database
    const allPets = await pets.find({});

    // Send the response with the fetched pets
    res.status(200).json({
      success: true,
      message: "All pets fetched successfully",
      data: allPets
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({
      success: false,
      message: "Failed to fetch pets",
      error: error.message
    });
  }


}



exports.getaPetController = async (req, res) => {


  try {
    // Extract the pet ID from the request parameters
    const petId = req.params.id;

    // Find the pet by its ID
    const pet = await pets.findById(petId);

    // If no pet is found, return a 404 error
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Send the response with the fetched pet
    res.status(200).json({
      success: true,
      message: "Pet fetched successfully",
      data: pet,
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({
      success: false,
      message: "Failed to fetch pet",
      error: error.message,
    });
  }


}



exports.updatepetController = async (req, res) => {



  try {
    const { id: petId } = req.params;
    const updates = req.body;

    // Validate request body
    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No update data provided"
      });
    }

    // List of allowed updates
    const allowedUpdates = [
      'name',
      'ageYears',
      'ageMonths',
      'breed',
      'gender',
      'size',
      'location',
      'status',
      'vaccines',
      'healthNotes',
      'contactPhone',
      'contactEmail',
      'justification'
    ];

    // Filter valid updates
    const validUpdates = Object.keys(updates).filter(key =>
      allowedUpdates.includes(key)
    );

    // Check if any valid updates exist
    if (validUpdates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields provided"
      });
    }

    // Create update object
    const updateObject = {};
    validUpdates.forEach(key => {
      updateObject[key] = updates[key];
    });

    // Find and update pet
    const updatedPet = await pets.findByIdAndUpdate(
      petId,
      updateObject,
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: updatedPet
    });

  } catch (error) {
    console.error("Update error:", error);

  }



  
}


exports.deletePetController = async (req, res) => {


  try {
    const petId = req.params.id;
    console.log(petId);



    // Find and delete the pet
    const deletedPet = await pets.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found"
      });
    }


    res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
      data: {
        id: deletedPet._id,
        name: deletedPet.name
      }
    });

  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }


}


// petController.js
exports.addAdminPetController = async (req, res) => {
  try {
    // Extract required fields from request body
    const {
      name,
      ageYears,
      ageMonths,
      location,
      petType,
      breed,
      gender,
      size,
      coatType,
      vaccines,
      medicationInfo,
      healthNotes,
      justification,
      contactEmail,
      contactPhone
    } = req.body;


    const petimg = req.file.filename

    console.log(req);


    // Validate required fields
    if (!name || !petType || !gender || !req.body.userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, petType, gender, or user authentication'
      });
    }

    // Create new pet object
    const newPet = new pets({
      name,
      ageYears: ageYears || 0,
      ageMonths: ageMonths || 0,
      location,
      petType,
      breed,
      gender,
      size,
      coatType,
      vaccines: vaccines || [],
      medicationInfo,
      healthNotes,
      petimg,
      justification,
      contactEmail,
      contactPhone,
      createdBy: req.body.userId // Assuming user is authenticated and attached to req.user
    });

    // Save to database
    const savedPet = await newPet.save();

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      pet: savedPet
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle duplicate key errors (if any)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Pet with this name already exists'
      });
    }

    // General error handling
    console.error('Error adding pet:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};