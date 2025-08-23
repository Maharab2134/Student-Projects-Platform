import React from "react";
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
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Password strength checker function
function getPasswordStrength(password) {
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
}

export default function AuthDialog({
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
}) {
  // Password strength calculation (only for registration)
  const passwordStrength = getPasswordStrength(registerForm.password);

  const isPhoneInvalid = registerForm.phone && registerForm.phone.length !== 11;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Paper elevation={0} sx={{ p: 0, bgcolor: "transparent" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 4,
          }}
        >
          <SchoolIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 2, letterSpacing: 1 }}
          >
            {authTab === 0 ? "Login" : "Register"}
          </Typography>
        </Box>
        <Tabs
          value={authTab}
          onChange={(_, v) => setAuthTab(v)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <DialogContent>
          {authTab === 0 ? (
            <Box component="form" onSubmit={onLogin}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                sx={{ mb: 2 }}
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                autoComplete="username"
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                sx={{ mb: 2 }}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
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
                color="primary"
                fullWidth
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: 2,
                  mt: 1,
                  fontSize: 17,
                }}
                disabled={isLockedOut}
              >
                {isLockedOut ? `Wait ${lockoutTime}s` : "Login"}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={onRegister}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.phone}
                type="tel"
                inputProps={{
                  maxLength: 11,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setRegisterForm((f) => ({ ...f, phone: value }));
                }}
                error={isPhoneInvalid}
                helperText={
                  isPhoneInvalid ? "Phone number must be 11 digits" : ""
                }
              />
              <TextField
                label="Institute Name"
                name="institute"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.institute}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, institute: e.target.value }))
                }
              />
              <TextField
                label="Address"
                name="address"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.address}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, address: e.target.value }))
                }
              />
              <TextField
                label="ID Number"
                name="idNumber"
                fullWidth
                sx={{ mb: 2 }}
                value={registerForm.idNumber}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, idNumber: e.target.value }))
                }
              />
              <TextField
                label="Password"
                name="password"
                type={showRegPassword ? "text" : "password"}
                fullWidth
                sx={{ mb: 1 }}
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, password: e.target.value }))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowRegPassword((show) => !show)}
                        edge="end"
                        size="small"
                      >
                        {showRegPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Password strength indicator */}
              {registerForm.password && (
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      passwordStrength === "Strong"
                        ? "green"
                        : passwordStrength === "Medium"
                        ? "orange"
                        : "red",
                    mb: 2,
                    ml: 1,
                    fontWeight: 600,
                  }}
                >
                  Password is {passwordStrength}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<PersonAddAltIcon />}
                sx={{
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: 2,
                  mt: 1,
                  fontSize: 17,
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </DialogContent>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
