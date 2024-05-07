import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { duration } from '@mui/material';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

export default function AddTraining({ addTraining }) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
        activity: '',
        duration: '',
        date: new Date(),
        customerFirstname: '',
        customerLastname: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const newTraining = {
            activity: training.activity,
            duration: training.duration,
            date: training.date,
            customer: {
                firstname: training.customerFirstName,
                lastname: training.customerLastName
            }
        };
        addTraining(newTraining);
        handleClose();
    };
    
    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Training"
                        value={training.activity}
                        onChange={e => setTraining({ ...training, activity: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Duration"
                        value={training.duration}
                        onChange={e => setTraining({ ...training, duration: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                     <DatePicker
                        selected={training.date}
                        onChange={date => setTraining({ ...training, date })}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                    />
                   <TextField
                        margin="dense"
                        label="First Name"
                        value={training.customerFirstName}
                        onChange={e => setTraining({ ...training, customerFirstName: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        value={training.customerLastName}
                        onChange={e => setTraining({ ...training, customerLastName: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}