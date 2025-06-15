// app/page.tsx
'use client';

import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',      // Center horizontally
        justifyContent: 'flex-start', // Start from top
        pt: 10,
      }}
    >
      <Typography variant="h4" gutterBottom>
          Welcome to the CNG Digital Twin System
        </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          px: 3,
          minWidth: 250,
          maxWidth: '50%',
        }}
      >
        <Button 
          component={Link} 
          href="/login" 
          variant="contained" 
          fullWidth
        >
          Login
        </Button>

        <Button
          component={Link}
          href="/register"
          variant="outlined"
          fullWidth
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}
