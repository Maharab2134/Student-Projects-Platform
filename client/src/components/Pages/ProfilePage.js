import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  Slide,
  Zoom,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  NightsStay as DarkIcon,
  WbSunny as LightIcon,
} from "@mui/icons-material";
import { keyframes, styled } from "@mui/system";
import axios from "axios";

const API = process.env.REACT_APP_API;

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components with dark mode support
const AnimatedCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "darkMode",
})(({ theme, darkMode }) => ({
  width: "100%",
  maxWidth: 600,
  borderRadius: 20,
  overflow: "visible",
  background: darkMode
    ? "linear-gradient(145deg, #2d2d2d, #1f1f1f)"
    : "linear-gradient(145deg, #ffffff, #f0f0f0)",
  color: darkMode ? "#fff" : "inherit",
  boxShadow: darkMode
    ? "0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(25, 118, 210, 0.25)"
    : "0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(25, 118, 210, 0.15)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: darkMode
      ? "0 25px 50px rgba(0,0,0,0.4), 0 15px 25px rgba(25, 118, 210, 0.3)"
      : "0 25px 50px rgba(0,0,0,0.15), 0 15px 25px rgba(25, 118, 210, 0.2)",
  },
}));

const GradientHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "darkMode",
})(({ theme, darkMode }) => ({
  height: 140,
  background: darkMode
    ? "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)"
    : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: "5px solid",
  borderColor: theme.palette.mode === "dark" ? "#424242" : "white",
  backgroundColor: "#42a5f5",
  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  "&:hover": {
    animation: `${pulseAnimation} 1.5s infinite`,
  },
}));

const IconTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "darkMode",
})(({ theme, darkMode }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.3s ease",
    backgroundColor: darkMode ? alpha(theme.palette.grey[800], 0.5) : undefined,
    color: darkMode ? "#fff" : "inherit",
    "&:hover": {
      backgroundColor: darkMode
        ? alpha(theme.palette.primary.main, 0.1)
        : alpha(theme.palette.primary.main, 0.04),
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "& .MuiInputBase-input": {
      color: darkMode ? "#fff" : "inherit",
    },
    "& .MuiInputLabel-root": {
      color: darkMode ? alpha(theme.palette.grey[400], 0.8) : "inherit",
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 20px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "16px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
}));

const ProfileInfoItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "darkMode",
})(({ theme, darkMode }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px 0",
  transition: "background-color 0.2s ease",
  borderRadius: 8,
  "&:hover": {
    backgroundColor: darkMode
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.03),
  },
}));

export default function ProfilePage({
  user,
  editProfile,
  setEditProfile,
  profileForm,
  setProfileForm,
  setSnackbar,
  setUser,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode to the entire document
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "" : "#f5f5f5";
    document.body.style.color = darkMode ? "#fff" : "inherit";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSave = async () => {
    try {
      await axios.put(`${API}/profile`, profileForm, {
        headers: { Authorization: user.token },
      });
      setEditProfile(false);
      setSnackbar({
        open: true,
        success: true,
        msg: "Profile updated successfully! 🎉",
      });
      if (setUser) setUser((prev) => ({ ...prev, ...profileForm }));
    } catch {
      setSnackbar({
        open: true,
        success: false,
        msg: "Profile update failed. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      institute: user?.institute || "",
      address: user?.address || "",
      idNumber: user?.idNumber || "",
    });
    setEditProfile(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
        overflow: "hidden",
        color: darkMode ? "#fff" : "inherit",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={800}>
        <AnimatedCard darkMode={darkMode}>
          <GradientHeader darkMode={darkMode} />

          {/* Dark mode toggle */}
          <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: "white",
                backgroundColor: alpha("#000", 0.2),
                "&:hover": { backgroundColor: alpha("#000", 0.3) },
              }}
            >
              {darkMode ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Box>

          <Box sx={{ position: "relative", mt: -9, mx: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ProfileAvatar>
                <PersonIcon sx={{ fontSize: 60 }} />
              </ProfileAvatar>

              {!editProfile && (
                <Zoom in={isHovered}>
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 20,
                      bottom: 0,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": { backgroundColor: "primary.dark" },
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => setEditProfile(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </Zoom>
              )}
            </Box>
          </Box>

          <CardContent sx={{ p: 4, pt: 2 }}>
            {!editProfile ? (
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    gutterBottom
                    color={darkMode ? "primary.light" : "primary.main"}
                    sx={{ mt: 2 }}
                  >
                    {user?.name}
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <ProfileInfoItem darkMode={darkMode}>
                      <EmailIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color={darkMode ? "grey.400" : "text.secondary"}
                          fontWeight={500}
                        >
                          Email
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={darkMode ? "grey.100" : "text.primary"}
                        >
                          {user?.email || "Not provided"}
                        </Typography>
                      </Box>
                    </ProfileInfoItem>

                    <Divider
                      sx={{
                        my: 0.5,
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    />

                    <ProfileInfoItem darkMode={darkMode}>
                      <PhoneIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color={darkMode ? "grey.400" : "text.secondary"}
                          fontWeight={500}
                        >
                          Phone
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={darkMode ? "grey.100" : "text.primary"}
                        >
                          {user?.phone || "Not provided"}
                        </Typography>
                      </Box>
                    </ProfileInfoItem>

                    <Divider
                      sx={{
                        my: 0.5,
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    />

                    <ProfileInfoItem darkMode={darkMode}>
                      <SchoolIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color={darkMode ? "grey.400" : "text.secondary"}
                          fontWeight={500}
                        >
                          Institute
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={darkMode ? "grey.100" : "text.primary"}
                        >
                          {user?.institute || "Not provided"}
                        </Typography>
                      </Box>
                    </ProfileInfoItem>

                    <Divider
                      sx={{
                        my: 0.5,
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    />

                    <ProfileInfoItem darkMode={darkMode}>
                      <LocationIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color={darkMode ? "grey.400" : "text.secondary"}
                          fontWeight={500}
                        >
                          Address
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={darkMode ? "grey.100" : "text.primary"}
                        >
                          {user?.address || "Not provided"}
                        </Typography>
                      </Box>
                    </ProfileInfoItem>

                    <Divider
                      sx={{
                        my: 0.5,
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    />

                    <ProfileInfoItem darkMode={darkMode}>
                      <BadgeIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color={darkMode ? "grey.400" : "text.secondary"}
                          fontWeight={500}
                        >
                          ID Number
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={darkMode ? "grey.100" : "text.primary"}
                        >
                          {user?.idNumber || "Not provided"}
                        </Typography>
                      </Box>
                    </ProfileInfoItem>
                  </Box>
                </Box>
              </Fade>
            ) : (
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    gutterBottom
                    color={darkMode ? "primary.light" : "primary.main"}
                    sx={{ mt: 2, mb: 4 }}
                  >
                    Edit Profile
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <IconTextField
                      darkMode={darkMode}
                      label="Name"
                      fullWidth
                      sx={{ mb: 3 }}
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm((f) => ({ ...f, name: e.target.value }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconTextField
                      darkMode={darkMode}
                      label="Email"
                      fullWidth
                      type="email"
                      sx={{ mb: 3 }}
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((f) => ({ ...f, email: e.target.value }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconTextField
                      darkMode={darkMode}
                      label="Phone"
                      fullWidth
                      sx={{ mb: 3 }}
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconTextField
                      darkMode={darkMode}
                      label="Institute"
                      fullWidth
                      sx={{ mb: 3 }}
                      value={profileForm.institute}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          institute: e.target.value,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SchoolIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconTextField
                      darkMode={darkMode}
                      label="Address"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ mb: 3 }}
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconTextField
                      darkMode={darkMode}
                      label="ID Number"
                      fullWidth
                      sx={{ mb: 4 }}
                      value={profileForm.idNumber}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          idNumber: e.target.value,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <ActionButton
                        fullWidth
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={handleCancel}
                        sx={{
                          color: darkMode ? "grey.400" : "text.secondary",
                          borderColor: darkMode ? "grey.600" : "text.secondary",
                          "&:hover": {
                            borderColor: darkMode ? "grey.500" : "text.primary",
                            backgroundColor: darkMode
                              ? alpha("#fff", 0.05)
                              : undefined,
                          },
                        }}
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton
                        fullWidth
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                      >
                        Save Changes
                      </ActionButton>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            )}
          </CardContent>
        </AnimatedCard>
      </Slide>
    </Box>
  );
}
