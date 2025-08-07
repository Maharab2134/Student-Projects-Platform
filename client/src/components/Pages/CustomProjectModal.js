import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function CustomProjectToggleForm({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    university: "",
    subject: "",
    type: "",
    deadline: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill user data when user changes or form opens
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        userId: user.id || user._id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        university: user.institute || "",
      }));
    }
  }, [user, showForm]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate days left for the selected deadline
  const getDaysLeft = () => {
    if (!form.deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(form.deadline);
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/request", form, {
        headers: { Authorization: user.token },
      });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", my: 2, px: 1 }}>
      {!showForm ? (
        <Typography
          variant="h4"
          color="primary"
          sx={{
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 700,
            my: 2,
            transition: "color 0.2s",
            "&:hover": { color: "secondary.main", textDecoration: "underline" },
          }}
          onClick={() => setShowForm(true)}
        >
          Customized Project
        </Typography>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            position: "relative",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <IconButton
            onClick={() => setShowForm(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mb: 1.5, textAlign: "center" }}
          >
            Request a Customized Project
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: "text.secondary", textAlign: "center" }}
          >
            Fill out the form below and our team will contact you soon.
          </Typography>

          {submitted ? (
            <Typography
              variant="h6"
              color="success.main"
              sx={{ textAlign: "center", my: 3 }}
            >
              Thank you! We have received your request.
            </Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="University"
                        name="university"
                        value={form.university}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                        fullWidth
                        placeholder="Academic / Personal / Other"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl sx={{ minWidth: 190 }}>
                        <InputLabel>Type of Category</InputLabel>
                        <Select
                          label="Type of Category"
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                        >
                          <MenuItem value="App">App</MenuItem>
                          <MenuItem value="Web">Web</MenuItem>
                          <MenuItem value="ML">ML</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          label="Deadline"
                          name="deadline"
                          type="date"
                          value={form.deadline}
                          onChange={handleChange}
                          required
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        {form.deadline && (
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              variant="body2"
                              color={
                                daysLeft < 0
                                  ? "error"
                                  : daysLeft < 3
                                  ? "warning.main"
                                  : daysLeft < 7
                                  ? "info.main"
                                  : "success.main"
                              }
                              fontWeight={600}
                            >
                              {daysLeft < 0
                                ? "Invalid date"
                                : daysLeft === 0
                                ? "Today! - Tight deadline!"
                                : `${daysLeft} day${
                                    daysLeft > 1 ? "s" : ""
                                  } left - ${
                                    daysLeft < 3
                                      ? "Tight deadline!"
                                      : daysLeft < 7
                                      ? "Manageable"
                                      : "Plenty of time"
                                  }`}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          label="Project Description"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          required
                          fullWidth
                          multiline
                          minRows={3}
                          maxRows={8}
                          placeholder="Describe your project requirements, features, or any special instructions..."
                          variant="outlined"
                          sx={{
                            width: { xs: "100%", sm: 500, md: 700 },
                            background: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#232b36"
                                : "#f9f9f9",
                            borderRadius: 2,
                            "& .MuiInputBase-input": {
                              fontSize: 16,
                              lineHeight: 1.7,
                              color: "text.primary",
                            },
                          }}
                          inputProps={{ maxLength: 1000 }}
                          helperText={`${form.description.length}/1000 characters`}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ width: 200, mx: "auto", display: "block" }}
                  >
                    Submit Request
                  </Button>
                </Stack>
              </Box>
            </form>
          )}
        </Paper>
      )}
    </Box>
  );
}
