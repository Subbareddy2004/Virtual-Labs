const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};

const scheduleNotification = (userId, labId, reservationTime) => {
  const notificationTime = new Date(reservationTime.getTime() - 15 * 60000); // 15 minutes before
  setTimeout(async () => {
    // Send notification (e.g., email or push notification)
    await sendEmail(userId.email, 'Lab Reservation Reminder', `Your lab session starts in 15 minutes.`);
  }, notificationTime.getTime() - Date.now());
};

module.exports = { scheduleNotification, sendEmail };
