const express =require('express')

const userController =require('./controller/userController')

const bookingController =require('./controller/bookingController')

const adminController =require('./controller/adminController')

const notificationController =require('./controller/notificationController')


const adoptionUserController = require('./controller/adoptionUserController')


const petController = require('./controller/petcontroller')


const testimonialController = require('./controller/testimonialController')


const adoptionRequestController = require('./controller/adoptionRequestController')


const AdoptionNotificationController = require('./controller/AoptionNotificationController')

const jwt =require('./middleware/jwtMiddleware')

const multer =require('./middleware/multerMiddleware')


const router =new express.Router()

router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//get user data

router.get('/getuser',jwt,userController.getuserController)

router.get('/allusers',userController.getallUserController)

//edit profile
router.put('/edit-profile',jwt,multer.single("img"),userController.editprofileController)

//booking
router.post('/booking',jwt,bookingController.bookingDetailsController)

//getUserbooking

router.get('/getbooking',jwt,bookingController.getuserBookingController)

//add employee

router.post('/add-employee',jwt,multer.single("img"), adminController.addEmployeeController)

//get employee
router.get('/get-employee',jwt,adminController.getEmployeeController)

//delete employee

router.delete('/remove-employee/:id',adminController.deleteEmployeeController)

//get all booking

router.get('/get-allBooking',bookingController.getAllbookingController)

//get bookingUser

router.get('/get-bookingUser/:id',userController.getbookinguserController)


//message sending

router.post('/post-message',notificationController.messageController)

//get message

router.get('/get-message',jwt,notificationController.getMessageController)




//adoption

router.post('/adreg',adoptionUserController.adoptionregisterController)

//login
router.post('/adlogin',adoptionUserController.adoptionloginController)

//get user data

router.get('/getauser',jwt,adoptionUserController.getadoptionuserController)


router.get('/get-all-adoptionuser',adoptionUserController.getallAdoptionUserController)

//edit profile
router.put('/edit-adoption-profile',jwt,multer.single("img"),adoptionUserController.editadoptionprofileController)




router.post('/service',jwt,multer.single("petimg"),petController.addPetController)

router.post('/admanagement',jwt,multer.single("petimg"),petController.addAdminPetController)


router.get('/get-all-pet',petController.getAllPetsController)


router.get('/get-a-pet',petController.getaPetController)


router.delete('/delete-pet/:id',petController.deletePetController)


router.put('/update-pet/:id',petController.updatepetController)

/* adoption controller */

router.post('/adoption-Form',adoptionRequestController.addAdoptionRequest)

router.get('/adoption-requests',adoptionRequestController.getAllAdoptionRequests)


router.put('/adoption-requests/:id',adoptionRequestController.updateRequestController)


/* testimonials */

router.get('/get-a-adoptionuser/:id',adoptionUserController.getadoptionuserIdController)

router.post('/add-testimonial',testimonialController.addTestimonialController)



router.get('/get-testimonials',testimonialController.getTestimonialController)


/* add notification */


router.post('/add-notification',AdoptionNotificationController.addAdoptionNotification)












module.exports=router