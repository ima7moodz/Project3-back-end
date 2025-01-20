const express = require("express")
const Class = require("../models/Class")
const User = require("../models/User")
const { verifyToken } = require("../middleware/jwtUtils")
const router = express.Router()

//create class
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainer can create classes." })
    }

    req.body.userId = req.user._id

    const createClass = await Class.create(req.body)
    res.status(201).json(createClass)
  } catch (error) {
    console.error("Error creating class:", error)
    res.status(400).json({ error: error.message })
  }
})

//get class
router.get("/", async (req, res) => {
  try {
    const getClass = await Class.find()
    res.status(200).json(getClass)
  } catch (error) {
    console.error("Error fetching class:", error)
    res.status(500).json({ error: error.message })
  }
})

//get class By ID
router.get("/:classId", async (req, res) => {
  try {
    const showClass = await Class.findById(req.params.classId)
    if (!showClass) {
      return res.status(404).json({ error: "Class not found." })
    }
    res.status(200).json(showClass)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//update class
router.put("/:classId", verifyToken, async (req, res) => {
  try {
    const showClass = await Class.findById(req.params.classId)
    if (!showClass) {
      return res.status(404).json({ error: "Class not found." })
    }

    if (
      req.user.role === "trainer" &&
      showClass.userId.toString() === req.user._id
    ) {
      const updateClass = await Class.findByIdAndUpdate(
        req.params.classId,
        req.body,
        { new: true }
      )
      return res.status(200).json(updateClass)
    }

    return res.status(403).json({ error: "Access denied!!!" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//delete class
router.delete("/:classId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Access denied." })
    }

    const showClass = await Class.findById(req.params.classId)
    if (!showClass) {
      return res.status(404).json({ error: "Class not found." })
    }

    await Class.findByIdAndDelete(req.params.classId)
    res.status(200).json({ message: "Class deleted successfully." })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
