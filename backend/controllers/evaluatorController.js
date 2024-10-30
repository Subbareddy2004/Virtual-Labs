const Lab = require('../models/Lab');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

exports.getAssignedLabs = async (req, res) => {
  try {
    const labs = await Lab.find({ evaluators: req.user.id });
    res.json(labs);
  } catch (error) {
    console.error('Error fetching assigned labs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true, role: 'student' });
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLabDetails = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.labId).populate('students');
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentReports = async (req, res) => {
  try {
    const reports = await Grade.find({ lab: req.params.labId }).populate('student');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find({ lab: req.params.labId }).populate('student');
    // Generate CSV file here
    res.download('path/to/generated/csv/file');
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.gradeStudent = async (req, res) => {
  try {
    const { studentId, labId, grade, type } = req.body;
    let gradeRecord = await Grade.findOne({ student: studentId, lab: labId });
    
    if (!gradeRecord) {
      gradeRecord = new Grade({ student: studentId, lab: labId });
    }

    if (type === 'project') {
      gradeRecord.projectGrade = grade;
    } else if (type === 'labSession') {
      gradeRecord.labSessionGrade = grade;
    }

    await gradeRecord.save();
    res.json({ message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
