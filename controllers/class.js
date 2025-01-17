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

module.exports = router
