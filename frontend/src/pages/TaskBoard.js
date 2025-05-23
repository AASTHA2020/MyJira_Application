import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { fetchTasks, createTask, updateTask, deleteTask } from '../features/tasks/taskSlice';

function TaskBoard() {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks);
    }
  }, [tasks]);


   const handleOpen = (task = null) => {
    if (task) {
      console.log('Edit action triggered for task id:', task._id);
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
      });
    } else {
      console.log('Add action triggered');
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    console.log('Dialog closed');
    setOpen(false);
    setSelectedTask(null);
  };

  const handleChange = (e) => {
    console.log('Form field changed:', e.target.name, 'Value:', e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      console.log('Update action for task id:', selectedTask._id, 'with data:', formData);
      dispatch(updateTask({ id: selectedTask._id, taskData: formData }));
    } else {
      console.log('Create action with data:', formData);
      dispatch(createTask({ ...formData, assignee: user._id, status: 'todo' }));
    }
    handleClose();
  };

  const handleDelete = (taskId) => {
    console.log('Delete action triggered for task id:', taskId);
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
      console.log("deletede")
    }
  };

  const getTasksByStatus = () => {
    const statuses = ['todo', 'in-progress', 'completed'];
    const columns = {};

    statuses.forEach((status) => {
      columns[status] = {
        title:
          status === 'todo'
            ? 'To Do'
            : status === 'in-progress'
            ? 'In Progress'
            : 'Completed',
        items: [],
      };
    });

    tasks.forEach((task) => {
      const status = task.status || 'todo';
      if (columns[status]) {
        columns[status].items.push(task);
      }
    });

    return columns;
  };

const onDragEnd = (result) => {
  if (!result.destination) return;

  const { source, destination, draggableId } = result;

  const updatedTasks = [...localTasks];
  const taskIndex = updatedTasks.findIndex((t) => t._id === draggableId);
  if (taskIndex === -1) return;

  // Update local state first
  const updatedTask = {
    ...updatedTasks[taskIndex],
    status: destination.droppableId,
  };
  updatedTasks[taskIndex] = updatedTask;
  setLocalTasks(updatedTasks); // 👈 Optimistic UI update

  // Dispatch to backend
  dispatch(updateTask({ id: draggableId, taskData: updatedTask }));
};


  const getTasksByStatusFromLocal = () => {
    const statuses = ['todo', 'in-progress', 'completed'];
    const columns = {};

    statuses.forEach((status) => {
      columns[status] = {
        title:
          status === 'todo'
            ? 'To Do'
            : status === 'in-progress'
            ? 'In Progress'
            : 'Completed',
        items: [],
      };
    });

    localTasks.forEach((task) => {
      const status = task.status || 'todo';
      if (columns[status]) {
        columns[status].items.push(task);
      }
    });

    return columns;
  };
  const tasksByStatus = getTasksByStatusFromLocal();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Task Board</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Object.entries(tasksByStatus).map(([columnId, column]) => (
            <Paper
              key={columnId}
              sx={{
                p: 2,
                width: '33%',
                minHeight: '70vh',
                backgroundColor: '#f5f5f5',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#eeeeee',
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {column.title} ({column.items.length})
              </Typography>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: '60vh',
                      backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                      transition: 'background-color 0.3s ease',
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={String(task._id)} draggableId={String(task._id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 2,
                              cursor: 'grab',
                              backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                              transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: 3,
                                transform: 'translateY(-2px)',
                              },
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6">{task.title}</Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Chip
                                  label={task.priority}
                                  color={
                                    task.priority === 'high'
                                      ? 'error'
                                      : task.priority === 'medium'
                                      ? 'warning'
                                      : 'success'
                                  }
                                  size="small"
                                />
                                <Chip
                                  label={new Date(task.dueDate).toLocaleDateString()}
                                  size="small"
                                />
                              </Box>
                            </CardContent>
                            <CardActions>
                              <IconButton
                                size="small"
                                onClick={() => handleOpen(task)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(task._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <IconButton size="small">
                                <CommentIcon />
                              </IconButton>
                            </CardActions>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="taskForm"
            sx={{ mt: 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            form="taskForm"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading
              ? selectedTask
                ? 'Updating...'
                : 'Creating...'
              : selectedTask
              ? 'Update'
              : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default TaskBoard;
