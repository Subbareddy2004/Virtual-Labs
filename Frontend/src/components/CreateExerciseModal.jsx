import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import api from '../utils/api';

function CreateExerciseModal({ open, onClose, onSubmit }) {
  const [lab, setLab] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    if (open) {
      fetchLabs();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ lab, title, description });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Exercise</DialogTitle>
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
          <TextField
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateExerciseModal;