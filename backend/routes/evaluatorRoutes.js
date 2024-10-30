const express = require('express');
const router = express.Router();
const evaluatorController = require('../controllers/evaluatorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/assigned-labs', evaluatorController.getAssignedLabs);
router.get('/active-users', evaluatorController.getActiveUsers);
router.get('/lab-details/:labId', evaluatorController.getLabDetails);
router.get('/student-reports/:labId', evaluatorController.getStudentReports);
router.get('/attendance-report/:labId', evaluatorController.getAttendanceReport);
router.post('/grade', evaluatorController.gradeStudent);

module.exports = router;
