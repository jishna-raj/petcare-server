const employee=require('../model/employeeModel')



//add employee
exports.addEmployeeController=async(req,res)=>{

 
    
    const{name , mobile ,license,place,designation}=req.body
    console.log(req.body);
    const profileImg = req.file?req.file.filename:img
    const userId=req.payload

    console.log(profileImg);

    try {
      const existingEmpoyee =await employee.findOne({mobile})

      if (existingEmpoyee) {
        res.status(406).json("employee is already exist")
      } else {
        const newEmployee=new employee({
          name , mobile ,license,place,designation,img:profileImg,userId
        })
        await newEmployee.save()
        res.status(200).json(newEmployee)
      }
      
    } catch (error) {
      res.status(401).json(error)
    }
    
}

//get all employee

exports.getEmployeeController = async(req,res)=>{
  const userId = req.payload
  try {
    const employeeDetails = await employee.find({userId})
    res.status(200).json(employeeDetails)
    
  } catch (error) {
    res.status(401).json(error)
  }
}

//delete employee
exports.deleteEmployeeController= async(req,res)=>{
  const {id} =req.params
  try {
    const item =await employee.findByIdAndDelete({_id:id})
    res.status(200).json('deleted successfully')
  } catch (error) {
    res.status(401).json(error)
    
  }
}



