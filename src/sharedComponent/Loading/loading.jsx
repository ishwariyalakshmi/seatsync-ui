import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null; // Only show when loading is true

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // above everything
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
