const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/assigned-labs', mentorController.getAssignedLabs);
router.get('/active-users', mentorController.getActiveUsers);
router.get('/lab-details/:labId', mentorController.getLabDetails);
router.get('/student-reports/:labId', mentorController.getStudentReports);
router.get('/attendance-report/:labId', mentorController.getAttendanceReport);

module.exports = router;
