// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/Auth/actions";  
import { Box, Button, TextField, Typography } from "@mui/material";
import logo from '../../assets/SeatNSyncLogo.jpeg';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    dispatch(loginStart());
    try {      
      if (employeeId && password === "password") {
        dispatch(loginSuccess({ employeeId }));       
        navigate("/booked-seats");
      } else {
        dispatch(loginFailure("Invalid credentials"));
        alert("Login failed: Invalid credentials");
      }
    } catch (err) {
      dispatch(loginFailure("Server error"));
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        margin: "auto",
        marginTop: 10,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >

      <Box sx={{ textAlign: "center", mb: 2 }}>
  <img 
    src={logo} 
    alt="App Logo" 
    style={{ width: 100, height: "auto", marginBottom: 10 }} 
  />
</Box>

      <Typography variant="h5" mb={2}>
        Employee Login
      </Typography>
      <TextField
        fullWidth
        label="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleLogin}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
};

export default LoginPage;
