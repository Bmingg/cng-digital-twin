"use client";

import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { httpPost$Login } from "@/lib/commands/Login/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { access_token } = await httpPost$Login(
        `${CLIENT_ENV.BACKEND_URL}/api/users/auth/login`,
        {
          username: email,
          password,
          grant_type: "password",
        }
      );
      setCookie("token", access_token);
      setOpen(true);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("An error has happened. Please try again!");
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={() => setOpen(false)}
            message="Login successfully!"
          />
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
