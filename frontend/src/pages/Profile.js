import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120 }}
              alt={user?.name || 'User'}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {user?.name || 'User Name'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.email || 'user@example.com'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 