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


const groomerController = require('./controller/groomerController')

const groomerTestimonialController = require('./controller/groomerTestimonialController')

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

//getallUserbooking

router.get('/getbooking/:id',bookingController.getAUserAllbookingController)



//add employee

router.post('/add-employee',jwt,multer.single("img"), adminController.addEmployeeController)

//get employee
router.get('/get-employee',jwt,adminController.getEmployeeController)

//delete employee

router.delete('/remove-employee/:id',adminController.deleteEmployeeController)

//get all booking in booking model

router.get('/get-allBooking',bookingController.getuserBookingController)

//get that bookingUser details

router.get('/get-bookingUser/:id',userController.getbookinguserController)


//message sending

router.post('/post-message',notificationController.messageController)

//get message

router.get('/get-message/:id',notificationController.getMessageController)


router.delete('/delete-message/:id',notificationController.deleteNotificationController)




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









/* groommers */


router.post('/groomer-reg',multer.single("profilePicture"),groomerController.groomerRegisterController)

 
router.post('/groomer-log',groomerController.groomerloginController) 


router.get('/all-groomer',groomerController.getAllGroomersController)

router.get('/agroomer/:id',groomerController.getAGroomerController)



router.get('/getserviceworker',groomerController.getGroomerByserviceController)

router.put('/updategroomerStatus/:id',groomerController.groomerStatus)


router.get('/getgroomerbooking/:id',groomerController.getgroomerBookingController)


router.put('/update-groomer/:id',groomerController.updateGroomerController)


router.put('/update-booking-status/:id',bookingController.updatebookingStatusController) 



/* groomerTestimonial */

router.post('/add-groomertestimonial',groomerTestimonialController.addGroomerTestimonialController)

router.get('/get-all-groomerTestimonial',groomerTestimonialController.getallGroomerTestimonialController)


router.get('/get-home-groomerTestimonial',groomerTestimonialController.getHomeTestimonialController)












module.exports=router