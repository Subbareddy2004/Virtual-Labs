const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lab = require('../models/Lab');
const Exercise = require('../models/Exercise');
const Reservation = require('../models/Reservation');
const csv = require('csv-express');
const auth = require('../middleware/auth');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Apply auth and isAdmin middleware to all admin routes
router.use(auth, isAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const labCount = await Lab.countDocuments();
    const exerciseCount = await Exercise.countDocuments();
    const todaySessions = await Reservation.countDocuments({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    res.json({ userCount, labCount, exerciseCount, todaySessions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all labs
router.get('/labs', async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create lab
router.post('/labs', async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update lab
router.put('/labs/:id', async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) return res.status(404).json({ msg: 'Lab not found' });
    res.json(lab);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete lab
router.delete('/labs/:id', async (req, res) => {
  try {
    const lab = await Lab.findByIdAndRemove(req.params.id);
    if (!lab) return res.status(404).json({ msg: 'Lab not found' });
    res.json({ msg: 'Lab removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get lab usage
router.get('/lab-usage', async (req, res) => {
  try {
    const labUsage = await Reservation.aggregate([
      { $group: { _id: "$lab", count: { $sum: 1 } } },
      { $lookup: { from: "labs", localField: "_id", foreignField: "_id", as: "labInfo" } },
      { $unwind: "$labInfo" },
      { $project: { name: "$labInfo.name", usageCount: "$count" } }
    ]);
    res.json(labUsage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get current sessions
router.get('/current-sessions', async (req, res) => {
  try {
    const currentSessions = await Reservation.find({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('user lab');
    res.json(currentSessions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Generate reports
router.get('/reports/:type', async (req, res) => {
  const { type } = req.params;
  try {
    let data;
    switch (type) {
      case 'lab-usage':
        data = await Lab.find().select('name usageCount');
        break;
      case 'student-list':
        data = await User.find({ role: 'student' }).select('name email');
        break;
      case 'evaluator-list':
        data = await User.find({ role: 'evaluator' }).select('name email');
        break;
      case 'progress':
        // Implement progress report logic
        data = [{ message: "Progress report not implemented yet" }];
        break;
      case 'log':
        // Implement log report logic
        data = [{ message: "Log report not implemented yet" }];
        break;
      default:
        return res.status(400).json({ message: "Invalid report type" });
    }
    res.csv(data, true);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get available students (not enrolled in any lab)
router.get('/available-students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get available labs
router.get('/available-labs', async (req, res) => {
  try {
    const labs = await Lab.find().select('name');
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get available users by role
router.get('/available-users', async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.find({ role }).select('name email');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Enroll users
router.post('/enroll', auth, isAdmin, async (req, res) => {
  try {
    const { users, labId, role } = req.body;
    
    // Ensure users is an array
    const userArray = Array.isArray(users) ? users : [users];

    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    if (role === 'student') {
      lab.assignedStudents = [...new Set([...lab.assignedStudents, ...userArray])];
    } else if (role === 'mentor') {
      lab.assignedMentors = [...new Set([...lab.assignedMentors, ...userArray])];
    } else if (role === 'evaluator') {
      lab.assignedEvaluators = [...new Set([...lab.assignedEvaluators, ...userArray])];
    }

    await lab.save();

    res.json({ message: 'Users enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
