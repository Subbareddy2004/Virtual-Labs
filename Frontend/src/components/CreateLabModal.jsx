import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function CreateLabModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minSlots, setMinSlots] = useState('');
  const [maxSlots, setMaxSlots] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, minSlots: parseInt(minSlots), maxSlots: parseInt(maxSlots) });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Lab</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Lab Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="minSlots"
            label="Minimum Slots"
            type="number"
            fullWidth
            value={minSlots}
            onChange={(e) => setMinSlots(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="maxSlots"
            label="Maximum Slots"
            type="number"
            fullWidth
            value={maxSlots}
            onChange={(e) => setMaxSlots(e.target.value)}
            required
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

export default CreateLabModal;