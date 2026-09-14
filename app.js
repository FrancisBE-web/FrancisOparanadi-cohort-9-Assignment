//  ## MY ANSWERS 

// PART A NO.1 : USING " const student = await Student.findOne({ name });" IT RETURNS ONLY ONE STUDENT DOCUMENT,THE FIRST ADA CREATED, BUT USING "const student = await Student.find({ name });" ,IT RETURNS ALL STUDENTS DOCUMENTS OF ADA AVALIABLE. THE SHAPE OF THE JSON THE CLIENT RECIEVES IS ACTUALY A NESTED ARRAY SHAPE.

// PART A NO.2 : IF THE ADMIN SEARCHES ada ,IT RETURNS AN EMPTY OBJECT BUT IF SHE SEARCHES Ada IT RETURNS THE TWO CREATED ADA STUDENT DOCUMENT. BOTH RETURNS A SUCCESSFUL MESSAGE

// PART A NO.3 : WHY SHE STILL SEES THE OLD DOCUMENT IS BECAUSE SHE IS USING PARAMS TO UPDATE INSTEAD OF BODY ,PROPABLY USING A POST OR GET METHOD TO UPDATE INSTEAD OF PUT,AND HER URL ISNT CORRECT.
//  SHE PROBABLY DIDNT USE THE new:true UPDATE OPTION IN HER CODE THATS WHY SHE STILL GOT THE OLD DOCUMENTS. 
//"new: true" UPDATE OPTION RETURNS A NEWLY UPDATED DOCUMENT OF A STUDENT ,BECAUSE BY DEFAULT MONGODB RETURNS THE ORIGINAL DOCUMENT AS IT WAS BEFORE THE UPDATE TOOK PLACE.
// "runValidators" UPDATE OPTION . BY DEFAULT ,MONGOOSE CHECKS SCHEMA VALIDATION WHEN WE ARE CREATING DOCUMENTS BUT IT DOESNT WHEN UPDATE A DOCUMENT.USING THIS UPDATE UPTION IT FORCES MONGOOSE TO RUN SCHEMA VALIDATION IN THE INCOMING UPDATED DATA.

// PART A NO.4 : WITH A VALID OBEJECTID ,STUDENTS EXISTS AND RETURNS THE THE STUDENTS DOCUMENT WITH A 200:OK STATUS CODE. WITH A VALID OBJECTID,STUDENT DOESNT EXIST..IT RETURNS AN EMPTY STUDENT DOCUMENT (NULL),WITH A 200:OK STATUS CODE.
// CAST ERROR INDICATES THAT THE ID PROVIDED IS INVALID BUT, "DOCUMENT NOT FOUND" IDICATES THE ID IS VALID BUT NO DATA EXISTS WITH THAT ID IN MONGODB.
// IT RETURNS A STATUS OF 500 BECAUSE THE ID ISNT VALID ,THUS IT DOESNT ALSO EXIST.

// PART A NO.5 : THE ACTUIAL COLLECTION NAME IN MONGODB IS "students" .WHEN SOMEONE USES A WRONG COLLECTION NAME TO WRITE A QUERY IT RETURNS AN EMPTY COLLECTION AND THEN USER THINKS THERE NOTHING IN THE DATABSE BUT THERE IS,JUST A WRONG COLLECTION NAME WAS USED.

// PART A NO.6 : THE POST/create-student FAILS WHEN THE CLIENT FORGETS CONTENT-TYPE :APPLICATION/JSON BECAUSE ANY CONTENT WRITTEN NOT WRITEN IN JSON SYNTAX WONT CREATE,AS REQ.BODY WAS USED .
// THE ONE LINE THAT MAKES REQ.BODY WORK IN APP.JS IS "const { name, age, email, phone, address, course, institution } = req.body;"



const express = require('express');
const mongoose = require('mongoose');
const { error } = require('node:console');
const app = express();

const port = 4555;


app.use(express.json());


const databaseConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/techSchoolApp");
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
}

databaseConnection();


app.get("/", (req, res) => {
  res.send("Hello World");
});

const studentSchema = new mongoose.Schema({
  name: {
    type : String,
    required : true,
  },
  age: Number,
  email: {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
  },
  phone: String,
  address: String,
  course : {
    type : String,
    required : true,
    minlength: [2, "Course must be atleast 2 characters long"],
    enum : ["Computer Science", "Geology", "Software Engineering", "Mathematics","Biology"]
  },
  institution: String,
});

const Student = mongoose.model("Student", studentSchema);

app.post("/create-student", async (req, res) => {
  const { name, age, email, phone, address, course, institution } = req.body;
try {
  const student = new Student({ name, age, email, phone, address, course, institution });
  await student.save();
  return res.status(200).json({ message: "Student created successfully", student });
} catch (error) {
  if (error.code === 11000) {
    return res.status(409).json({ message: "Email is used already" });
   }
    if (["CastError", "ValidationError"].includes(error.name)) {
      return res.status(400).json({ message: error.message});
    }
  return res.status(500).json({ message: "Internal server error" });
}
  
});


app.get("/get-students", async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json({ message: "Students fetched successfully", students });
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
}); 


app.get("/get-student/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(400).json({message: "Student not found", student});
    }
    // only returns 200 when a student document exist
    return res.status(200).json({ message: "Student fetched successfully", student });
  } catch (error) { 
    // catches invalid id format or server error
    if (error.name === "CastError") {
      return res.status(400).json({ message: "id is not valid or exist" }); 
    }
   return res.status(500).json({ message : "internal server error"});
  }
    
});


app.patch("/students/:id/course", async (req, res) => {
  const { id } = req.params;
  const course = req.body.course?.trim();
     // checking if course field is missing
  if (!course ) {
      return res.status(400).json({message: "Course cant be empty and is required"});
    }
  try {
    // updates only the course field
    const student = await Student.findByIdAndUpdate(id, {course}, {new : true, runValidators : true});
    // checks valid id formats and student doesnt exist
    if (!student) {
      return res.status(404).json({message: "Student not found"});
    }
    // only returns 200 when a student course is updated
    return res.status(200).json({ message: "Student course uodated successfully", student : student });
  } catch (error) { 
    // catches invalid id format or server error
    if (error.name === "CastError") {
      return res.status(400).json({ message: "id is not a valid" });
    }
    if (error.name === "ValidationError"){
      return res.status(400).json({ message: "error.message" });
    }
   return res.status(500).json({ message : "internal server error"});
  }
    
});

app.get("/search-students", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({message: "No search found", student: []});
    }
    // Case-insensitive regex matching for "q"
    const searchRegex = new RegExp(q, "i");

    // perfom query across name,email,course

    const student = await Student.find({
      $or: [
      { name : { $regex: searchRegex}},
      { email : { $regex: searchRegex}},
      { course : { $regex: searchRegex}},

    ]});

    return res.status(200).json({ message: "Student searched successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Student not searched" });
  }
});


app.put("/update-student/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, email, phone, address, course, institution } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(id, { name, age, email, phone, address, course, institution }, { new: true });
    return res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/get-student-by-name', async (req, res) => {
  const { name } = req.query;
  try {
    const student = await Student.find({ name });
    return res.status(200).json({ message: "Student fetched successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-student/:id", async (req, res) => {

  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({message: "Student not found"});
    }
      return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({message: "Invalid id formaat"});
  }
    return res.status(500).json({ message: "Internal server error" }); 
}
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

