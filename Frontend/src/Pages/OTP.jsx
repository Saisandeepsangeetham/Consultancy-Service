import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import { generateOTP, verifyOtp } from "../Helpers/api_communicator";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const OTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setAlert({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateOTP(email);
      
      if (result.success) {
        setAlert({
          open: true,
          message: "OTP sent successfully! Please check your email",
          severity: "success",
        });
        setOtpSent(true);
      } else {
        setAlert({
          open: true,
          message: result.error || "Failed to send OTP",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred while sending OTP",
        severity: "error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      setAlert({
        open: true,
        message: "Please enter a valid 6-digit OTP",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp });
      
      if (result.success) {
        setAlert({
          open: true,
          message: "OTP verified successfully!",
          severity: "success",
        });

        sessionStorage.setItem("verified_email", email);
        
        setTimeout(() => {
          navigate("/forgotPsd");
        }, 1500);
      } else {
        setAlert({
          open: true,
          message: result.error || "OTP verification failed",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "OTP verification failed. Please try again.",
        severity: "error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    if (!email) {
      setAlert({
        open: true,
        message: "Email address is required",
        severity: "error",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await generateOTP(email);
      
      if (result.success) {
        setAlert({
          open: true,
          message: "OTP resent successfully! Please check your email",
          severity: "success",
        });
      } else {
        setAlert({
          open: true,
          message: result.error || "Failed to resend OTP",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred while resending OTP",
        severity: "error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <IconButton 
        sx={{ mb: 2 }} 
        onClick={goBack}
        color="primary"
      >
        <ArrowBackIcon /> Back
      </IconButton>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={3} alignItems="center">
          <Box sx={{ textAlign: "center" }}>
            <Box 
              sx={{ 
                display: "inline-flex", 
                bgcolor: "primary.light", 
                p: 2, 
                borderRadius: "50%", 
                mb: 2 
              }}
            >
              <LockIcon fontSize="large" color="primary" />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom fontWeight="medium">
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {otpSent 
                ? `Enter the verification code sent to ${email}` 
                : "Enter your email to receive a verification code"}
            </Typography>
          </Box>

          {!otpSent ? (
            <Box component="form" noValidate sx={{ width: "100%" }} onSubmit={handleSendOTP}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                required
                placeholder="Enter your email address"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
                startIcon={!loading && <SendIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Box>
          ) : (
            <Box component="form" noValidate sx={{ width: "100%" }} onSubmit={handleVerifyOTP}>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
                required
                inputProps={{ 
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                placeholder="Enter the 6-digit code"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                Didn't receive the code? 
                <Button 
                  color="primary" 
                  sx={{ ml: 1 }}
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
      
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OTP;