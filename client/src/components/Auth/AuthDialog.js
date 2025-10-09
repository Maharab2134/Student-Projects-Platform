import React, { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Fade,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Password strength checker function
const getPasswordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    return "Strong";
  }
  return "Medium";
};

// Memoized TextField component to prevent unnecessary re-renders
const OptimizedTextField = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    error = false,
    helperText = "",
    required = false,
    ...props
  }) => (
    <TextField
      label={label}
      fullWidth
      value={value}
      onChange={onChange}
      type={type}
      error={error}
      helperText={helperText}
      required={required}
      sx={{ mb: 2 }}
      variant="outlined"
      {...props}
    />
  )
);

const AuthDialog = ({
  open,
  onClose,
  onLogin,
  onRegister,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  showPassword,
  setShowPassword,
  showRegPassword,
  setShowRegPassword,
  snackbar,
  setSnackbar,
  authTab,
  setAuthTab,
  isLockedOut,
  lockoutTime,
}) => {
  const [loading, setLoading] = useState(false);

  // Memoized values
  const passwordStrength = getPasswordStrength(registerForm.password);
  const isPhoneInvalid = registerForm.phone && registerForm.phone.length !== 11;

  const isRegisterDisabled =
    !registerForm.name ||
    !registerForm.email ||
    !registerForm.phone ||
    !registerForm.address ||
    !registerForm.password ||
    isPhoneInvalid ||
    loading;

  // Optimized handlers with useCallback
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      await onLogin(e);
      setLoading(false);
    },
    [onLogin]
  );

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      await onRegister(e);
      setLoading(false);
    },
    [onRegister]
  );

  const handleTabChange = useCallback((_, v) => setAuthTab(v), [setAuthTab]);

  // Optimized change handlers
  const handleLoginChange = useCallback(
    (field) => (e) => {
      setLoginForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [setLoginForm]
  );

  const handleRegisterChange = useCallback(
    (field) => (e) => {
      setRegisterForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [setRegisterForm]
  );

  const handlePhoneChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, "");
      setRegisterForm((prev) => ({ ...prev, phone: value }));
    },
    [setRegisterForm]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [setShowPassword]);

  const toggleShowRegPassword = useCallback(() => {
    setShowRegPassword((prev) => !prev);
  }, [setShowRegPassword]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, [setSnackbar]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", pt: 4, pb: 2 }}>
        <SchoolIcon
          sx={{
            fontSize: 48,
            color: "primary.main",
            mb: 1,
          }}
        />
        <Typography variant="h5" fontWeight={600} color="primary.main">
          {authTab === 0 ? "Welcome Back" : "Join Us"}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={authTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
        }}
      >
        <Tab label="Login" sx={{ fontWeight: 600, fontSize: "0.95rem" }} />
        <Tab label="Register" sx={{ fontWeight: 600, fontSize: "0.95rem" }} />
      </Tabs>

      <DialogContent sx={{ pt: 3 }}>
        {authTab === 0 ? (
          // Login Form
          <Box component="form" onSubmit={handleLogin}>
            <OptimizedTextField
              label="Email"
              value={loginForm.email}
              onChange={handleLoginChange("email")}
              autoComplete="username"
              required
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 3 }}
              value={loginForm.password}
              onChange={handleLoginChange("password")}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              sx={{
                fontWeight: 600,
                py: 1.2,
                borderRadius: 2,
                fontSize: "1rem",
              }}
              disabled={isLockedOut || loading}
            >
              {isLockedOut ? `Try again in ${lockoutTime}s` : "Sign In"}
            </Button>
          </Box>
        ) : (
          // Register Form
          <Box component="form" onSubmit={handleRegister}>
            <OptimizedTextField
              label="Full Name"
              value={registerForm.name}
              onChange={handleRegisterChange("name")}
              required
            />
            <OptimizedTextField
              label="Email"
              value={registerForm.email}
              onChange={handleRegisterChange("email")}
              required
            />
            <OptimizedTextField
              label="Phone"
              value={registerForm.phone}
              onChange={handlePhoneChange}
              type="tel"
              inputProps={{
                maxLength: 11,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              error={isPhoneInvalid}
              helperText={
                isPhoneInvalid ? "Phone number must be 11 digits" : ""
              }
              required
            />
            <OptimizedTextField
              label="Institute (optional)"
              value={registerForm.institute}
              onChange={handleRegisterChange("institute")}
            />
            <OptimizedTextField
              label="Address"
              value={registerForm.address}
              onChange={handleRegisterChange("address")}
              required
            />
            <OptimizedTextField
              label="ID Number (optional)"
              value={registerForm.idNumber}
              onChange={handleRegisterChange("idNumber")}
            />
            <TextField
              label="Password"
              type={showRegPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 1 }}
              value={registerForm.password}
              onChange={handleRegisterChange("password")}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowRegPassword}
                      edge="end"
                      size="small"
                    >
                      {showRegPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Simple Password Strength */}
            {registerForm.password && (
              <Typography
                variant="caption"
                sx={{
                  color:
                    passwordStrength === "Strong"
                      ? "success.main"
                      : passwordStrength === "Medium"
                      ? "warning.main"
                      : "error.main",
                  mb: 2,
                  display: "block",
                  fontWeight: 500,
                }}
              >
                Password strength: {passwordStrength}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PersonAddAltIcon />
                )
              }
              sx={{
                fontWeight: 600,
                py: 1.2,
                borderRadius: 2,
                mt: 1,
                fontSize: "1rem",
              }}
              disabled={isRegisterDisabled}
            >
              Create Account
            </Button>
          </Box>
        )}
      </DialogContent>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default memo(AuthDialog);
