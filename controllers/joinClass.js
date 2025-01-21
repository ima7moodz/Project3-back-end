const express = require("express")
const JoinClass = require("../models/JoinClass")
const { verifyToken } = require("../middleware/jwtUtils")
const Class = require("../models/Class")
const router = express.Router()

//join class
router.post("/", verifyToken, async (req, res) => {
  const { userId, classId } = req.body

  if (!userId || !classId)
    return res.status(400).json({ message: "Missing required fields" })

  try {
    const joining = new JoinClass({ userId, classId })
    await joining.save()
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $inc: { traineesInClass: 1 } },
      { new: true }
    )

    res.status(201).json({ joining, updatedClass })
  } catch (error) {
    console.error("Error joining class:", error)
    res.status(400).json({ error: error.message })
  }
})

//get joined Classes
router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params

  try {
    const joinedClasses = await JoinClass.find({ userId }).populate("classId")
    res.status(200).json(joinedClasses.map((entry) => entry.classId))
  } catch (error) {
    console.error("Error fetching joined classes:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
