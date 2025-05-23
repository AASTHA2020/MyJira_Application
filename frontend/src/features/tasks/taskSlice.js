import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, getAuthHeader());
      return response.data.data.tasks;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        taskData,
        getAuthHeader()
      );
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create task' });
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/tasks/${id}`,
        taskData,
        getAuthHeader()
      );
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update task' });
    }
  }
);

// Redux async thunk – this is correct
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    console.log('deleteTask called with id:', id);
    try {
      console.log('Attempting to delete task...');
      const url = `${API_URL}/tasks/${id}`;
      console.log('Delete URL:', url);
      const headers = getAuthHeader();
      console.log('Headers:', headers);
      await axios.delete(url, headers);
      console.log('Task deleted successfully');
      return id;
    } catch (error) {
      console.log('Error deleting task:', error);
      if (error.response && error.response.data) {
        console.log('Error response data:', error.response.data);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Unknown error' });
    }
  }
);


// Add comment
export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks/${taskId}/comments`,
        { text: comment },
        getAuthHeader()
      );
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete task';
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add comment';
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer; 