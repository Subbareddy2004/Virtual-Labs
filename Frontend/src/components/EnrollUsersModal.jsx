import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';
import api from '../utils/api';

function EnrollUsersModal({ open, onClose, onSubmit }) {
  const [lab, setLab] = useState('');
  const [evaluator, setEvaluator] = useState('');
  const [mentor, setMentor] = useState('');
  const [students, setStudents] = useState([]);
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      fetchLabs();
      fetchUsers();
    }
  }, [open]);

  const fetchLabs = async () => {
    try {
      const res = await api.get('/admin/labs');
      setLabs(res.data);
    } catch (err) {
      console.error('Error fetching labs:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ lab, evaluator, mentor, students });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enroll Users</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Select
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            fullWidth
            label="Lab"
          >
            {labs.map((lab) => (
              <MenuItem key={lab._id} value={lab._id}>{lab.name}</MenuItem>
            ))}
          </Select>
          <Select
            value={evaluator}
            onChange={(e) => setEvaluator(e.target.value)}
            fullWidth
            label="Evaluator"
          >
            {users.filter(user => user.role === 'evaluator').map((user) => (
              <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
            ))}
          </Select>
          <Select
            value={mentor}
            onChange={(e) => setMentor(e.target.value)}
            fullWidth
            label="Mentor"
          >
            {users.filter(user => user.role === 'mentor').map((user) => (
              <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
            ))}
          </Select>
          <Select
            multiple
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            fullWidth
            label="Students"
          >
            {users.filter(user => user.role === 'student').map((user) => (
              <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Enroll</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EnrollUsersModal;
