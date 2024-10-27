import React, { useState } from 'react';

function ChangePasswordForm({ onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      onSubmit({ currentPassword, newPassword });
    } else {
      alert('New passwords do not match');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for current password, new password, and confirm password */}
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
