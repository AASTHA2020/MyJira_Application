import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    weeklyProgress: [],
  });

  useEffect(() => {
    // Calculate task statistics
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;

    // Calculate weekly progress
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate.toDateString() === date.toDateString();
      });

      const dayCompleted = dayTasks.filter(task => task.status === 'completed').length;
      const dayTotal = dayTasks.length;
      const percentage = dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0;

      return {
        date,
        completed: dayCompleted,
        total: dayTotal,
        percentage,
      };
    });

    setStats({
      total,
      completed,
      pending,
      weeklyProgress,
    });
  }, [tasks]);

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>

      {/* Task Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TaskIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{stats.total}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Tasks
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CompletedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4">{stats.completed}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Completed Tasks
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4">{stats.pending}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Pending Tasks
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Weekly Progress */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Weekly Progress
        </Typography>
        <Grid container spacing={2}>
          {stats.weeklyProgress.map((day, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {getDayName(day.date)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={day.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(day.percentage)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {day.completed} of {day.total} tasks completed
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 