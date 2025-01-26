import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Card, CardContent, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from 'react-dnd';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  display: 'flex',
  justifyContent: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

// Task Component
const TaskCard = ({ task, moveTask, deleteTask, fromCategory }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, fromCategory },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      sx={{
        marginBottom: 2,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid #ddd',
        position: 'relative', // Ensures the button is positioned inside the card
        padding: 2, // Add some padding so the button doesn't get too close to the edge
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
      <Typography variant="h6" fontWeight="bold" color="text.primary">
          {task.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {task.description}
        </Typography>
        <IconButton
          sx={{
            position: 'absolute', // Positioning the delete button in the top-right corner
            top: 8,
            right: 8,
            color: 'red', // Color for the delete button
          }}
          onClick={() => deleteTask(task.id, fromCategory)}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

// Tasks Page Component
const Tasks = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    completed: [],
    done: [],
  });

  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Open the dialog
  const handleClickOpen = () => setOpenDialog(true);

  // Close the dialog
  const handleClose = () => {
    setOpenDialog(false);
    setTaskName('');
    setTaskDescription('');
  };

  // Handle the form submission
  const handleSubmit = () => {
    const newTask = {
      id: Date.now(), // Unique id for each task
      name: taskName,
      description: taskDescription,
      status: 'pending', // Default to pending
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      pending: [...prevTasks.pending, newTask],
    }));

    handleClose();
  };

  // Move task between categories
  const moveTask = (taskId, fromCategory, toCategory) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks[fromCategory].find((task) => task.id === taskId);
      const updatedFromCategory = prevTasks[fromCategory].filter((task) => task.id !== taskId);
      const updatedToCategory = [...prevTasks[toCategory], taskToMove];

      return {
        ...prevTasks,
        [fromCategory]: updatedFromCategory,
        [toCategory]: updatedToCategory,
      };
    });
  };

  // Delete task from a category
  const deleteTask = (taskId, fromCategory) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [fromCategory]: prevTasks[fromCategory].filter((task) => task.id !== taskId),
    }));
  };

  // Drop zone for tasks (drag over categories)
  const [, dropPending] = useDrop(() => ({
    accept: 'task',
    drop: (item) => moveTask(item.id, item.fromCategory, 'pending'),
  }));

  const [, dropCompleted] = useDrop(() => ({
    accept: 'task',
    drop: (item) => moveTask(item.id, item.fromCategory, 'completed'),
  }));

  const [, dropDone] = useDrop(() => ({
    accept: 'task',
    drop: (item) => moveTask(item.id, item.fromCategory, 'done'),
  }));

  return (
    <Box sx={{ flexGrow: 1, padding: 2, height: '100%' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Task Management
      </Typography>

      <Grid container spacing={2} sx={{ height: '100%', marginTop: '20px' }}>
        <Grid ref={dropPending} size={4} sx={{ height: '100%' }}>
          <Item>Pending</Item>
          {tasks.pending.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              moveTask={moveTask}
              deleteTask={deleteTask}
              fromCategory="pending"
            />
          ))}
        </Grid>

        <Grid ref={dropCompleted} size={4} sx={{ height: '100%' }}>
          <Item>Completed</Item>
          {tasks.completed.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              moveTask={moveTask}
              deleteTask={deleteTask}
              fromCategory="completed"
            />
          ))}
        </Grid>

        <Grid ref={dropDone} size={4} sx={{ height: '100%' }}>
          <Item>Done</Item>
          {tasks.done.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              moveTask={moveTask}
              deleteTask={deleteTask}
              fromCategory="done"
            />
          ))}
        </Grid>
      </Grid>

      {/* FAB Button */}
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>

      {/* Dialog for adding tasks */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;