import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",       // Center horizontally
        justifyContent: "flex-start",   // Center vertically
        pt: 10, 
      }}
    >
      <Box
        sx={{
          // mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          px: 3,
          minWidth: 250,
          maxWidth: "50%"
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the CNG Digital Twin System
        </Typography>

        <Button
          component={Link}
          to="/login"
          variant="contained"
          fullWidth
        >
          Login
        </Button>

        <Button
          component={Link}
          to="/register"
          variant="outlined"
          fullWidth
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
