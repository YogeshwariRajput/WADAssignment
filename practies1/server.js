require("dotenv").config(); // Load .env first

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Student = require("./models/student");
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.error(" MongoDB Connection Error:", err));

// ROUTES

// Get all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// Get student by name
app.get("/students/:name", async (req, res) => {
  const { name } = req.params;
  const student = await Student.find({ name });
  res.send(student);
});

// Add new student
app.post("/add-student", async (req, res) => {
  const { name, marks } = req.body;
  try {
    const newStudent = new Student({ name, marks });
    await newStudent.save();
    res.send("✅ Student added");
  } catch (err) {
    res.status(400).send(" Error adding student");
  }
});

// Delete student by name
app.delete("/delete-student/:name", async (req, res) => {
  const { name } = req.params;
  await Student.findOneAndDelete({ name });
  res.send(" Student deleted");
});

// Update student marks
app.put("/update", async (req, res) => {
  const { name, marks } = req.body;
  const updatedStudent = await Student.findOneAndUpdate(
    { name },
    { $set: { marks } },
    { new: true }
  );
  res.send(updatedStudent);
});

// Start server
app.listen(process.env.PORT, () => {
  console.log( 'Server is running on port ${process.env.PORT}');
});