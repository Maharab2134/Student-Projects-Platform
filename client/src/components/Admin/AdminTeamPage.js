import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

const API = process.env.REACT_APP_API;

// Suggested roles
const roleOptions = [
  "Founder & CEO",
  "Backend Developer",
  "Full-Stack Developer",
  "Database Administrator",
  "Android Developer",
  "Flutter Developer",
  "ML Developer",
  "UI/UX Designer",
  "Content & Social Media Manager",
  "Mobile Developer",
  "Frontend Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Project Coordinator",
  "Business Analyst",
  "Support Engineer",
  "Marketing Specialist",
  "Data Scientist",
  "Graphic Designer",
];

export default function AdminTeamPage({ user }) {
  const [team, setTeam] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", img: "" });

  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    success: true,
  });

  const fetchTeam = () => {
    axios.get(`${API}/team`).then((res) => setTeam(res.data));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpen = (member = null) => {
    if (member) {
      setEditMode(true);
      setSelected(member);
      setForm({ name: member.name, role: member.role, img: member.img });
    } else {
      setEditMode(false);
      setSelected(null);
      setForm({ name: "", role: "", img: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", role: "", img: "" });
    setSelected(null);
    setEditMode(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (event, newValue) => {
    setForm({ ...form, role: newValue || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selected) {
        await axios.put(`${API}/team/${selected._id}`, form, {
          headers: { Authorization: user.token },
        });
        setSnackbar({ open: true, msg: "Team member updated!", success: true });
      } else {
        await axios.post(`${API}/team`, form, {
          headers: { Authorization: user.token },
        });
        setSnackbar({ open: true, msg: "Team member added!", success: true });
      }
      fetchTeam();
      handleClose();
    } catch (err) {
      setSnackbar({
        open: true,
        msg: "Failed to save team member.",
        success: false,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${API}/team/${id}`, {
        headers: { Authorization: user.token },
      });
      setSnackbar({ open: true, msg: "Team member deleted!", success: true });
      fetchTeam();
    } catch {
      setSnackbar({
        open: true,
        msg: "Failed to delete team member.",
        success: false,
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 4, px: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={700} color="primary">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Member
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member._id} hover>
                <TableCell>
                  <Avatar
                    src={member.img}
                    alt={member.name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(member)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(member._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          {editMode ? "Edit Team Member" : "Add Team Member"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Autocomplete
              freeSolo
              options={roleOptions}
              value={form.role}
              onChange={handleRoleChange}
              onInputChange={handleRoleChange}
              renderInput={(params) => (
                <TextField {...params} label="Role" name="role" required />
              )}
            />
            <TextField
              label="Image URL"
              name="img"
              value={form.img}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </Box>
  );
}
