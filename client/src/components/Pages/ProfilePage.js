import React from "react";
import { Box, Typography, Avatar, Button, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

export default function ProfilePage({
  user,
  editProfile,
  setEditProfile,
  profileForm,
  setProfileForm,
  setSnackbar,
  setUser,
}) {
  
 const handleSave = async () => {
  try {
    await axios.put(
      "http://localhost:5000/api/profile",
      profileForm,
      { headers: { Authorization: user.token } }
    );
    setEditProfile(false);
    setSnackbar({ open: true, success: true, msg: "Profile updated!" });
    if (setUser) setUser(prev => ({ ...prev, ...profileForm }));
  } catch {
    setSnackbar({ open: true, success: false, msg: "Profile update failed" });
  }
};

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 4,
        border: "0.2px solid #e0e0e0",
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Avatar sx={{ bgcolor: "#1976d2", width: 80, height: 80, mb: 2 }}>
        <PersonIcon sx={{ fontSize: 48 }} />
      </Avatar>
      {!editProfile ? (
        <>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {user?.name}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Typography fontSize={15} sx={{ mb: 1 }}>
              <b>Email:</b> {user?.email}
            </Typography>
            <Typography fontSize={15} sx={{ mb: 1 }}>
              <b>Phone:</b> {user?.phone}
            </Typography>
            <Typography fontSize={15} sx={{ mb: 1 }}>
              <b>Institute:</b> {user?.institute}
            </Typography>
            <Typography fontSize={15} sx={{ mb: 1 }}>
              <b>Address:</b> {user?.address}
            </Typography>
            <Typography fontSize={15} sx={{ mb: 2 }}>
              <b>ID Number:</b> {user?.idNumber}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, fontWeight: 700, py: 1.2 }}
            onClick={() => setEditProfile(true)}
          >
            Edit
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Edit Profile
          </Typography>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={profileForm.name}
            onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={profileForm.email}
            onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
          <TextField label="Phone" fullWidth sx={{ mb: 2 }} value={profileForm.phone}
            onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
          <TextField label="Institute" fullWidth sx={{ mb: 2 }} value={profileForm.institute}
            onChange={e => setProfileForm(f => ({ ...f, institute: e.target.value }))} />
          <TextField label="Address" fullWidth sx={{ mb: 2 }} value={profileForm.address}
            onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))} />
          <TextField label="ID Number" fullWidth sx={{ mb: 2 }} value={profileForm.idNumber}
            onChange={e => setProfileForm(f => ({ ...f, idNumber: e.target.value }))} />
          <Box sx={{ display: "flex", gap: 2, mt: 2, width: "100%" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setEditProfile(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}