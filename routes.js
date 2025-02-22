const express =require('express')

const userController =require('./controller/userController')

const bookingController =require('./controller/bookingController')

const adminController =require('./controller/adminController')

const notificationController =require('./controller/notificationController')

const jwt =require('./middleware/jwtMiddleware')

const multer =require('./middleware/multerMiddleware')

const router =new express.Router()

router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//get user data

router.get('/getuser',jwt,userController.getuserController)

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







module.exports=router