require('dotenv').config()

const express =require('express')

const cors =require('cors')

const router =require('./routes')

require('./connection')

const petServer =express()

petServer.use(cors())

petServer.use(express.json())

petServer.use(router)

petServer.use('/uploads',express.static('./uploads'))

//port

const PORT =4000 || process.env.PORT

//server checking the request received at port

petServer.listen(PORT,()=>{
    console.log('server running successfully at port number',PORT);
    
})