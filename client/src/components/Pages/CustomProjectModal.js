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
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  Assignment,
  Send,
  CalendarToday,
  Category,
  School,
  Person,
  Email,
  Phone,
  Description,
} from "@mui/icons-material";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function CustomProjectToggleForm({ user }) {
  const [showForm, setShowForm] = useState(false);

  const getInitialForm = (user) => ({
    userId: user?.id || user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    university: user?.institute || "",
    subject: "",
    type: "",
    deadline: "",
    description: "",
  });

  const [form, setForm] = useState(getInitialForm(user));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (showForm) {
      setForm(getInitialForm(user));
      setSubmitted(false);
      setActiveStep(0);
      setError("");
    }
  }, [showForm, user]);

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
      setActiveStep(2);
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
  };

  const steps = ["Project Details", "Review & Submit"];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4, px: 1 }}>
      {!showForm ? (
        <Zoom in={!showForm} timeout={500}>
          <Card
            sx={{
              cursor: "pointer",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: isDarkMode
                ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => setShowForm(true)}
          >
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <Assignment
                sx={{
                  fontSize: 60,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                color="primary.main"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                Need a Custom Project?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500, mx: "auto", mb: 2 }}
              >
                Tell us your requirements and we'll create a tailored solution
                for your academic or personal needs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                }}
              >
                Request Now
              </Button>
            </CardContent>
          </Card>
        </Zoom>
      ) : (
        <Fade in={showForm} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              position: "relative",
              maxWidth: 900,
              mx: "auto",
              background: isDarkMode
                ? "linear-gradient(to bottom, #232b36, #1a202c)"
                : "linear-gradient(to bottom, #ffffff, #f8f9fa)",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            <IconButton
              onClick={() => {
                setShowForm(false);
                setActiveStep(0);
              }}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "grey.500",
                backgroundColor: isDarkMode ? "grey.700" : "grey.100",
                "&:hover": {
                  backgroundColor: isDarkMode ? "grey.600" : "grey.200",
                },
              }}
            >
              <Close />
            </IconButton>

            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary.main"
                sx={{ mb: 1 }}
              >
                Request a Custom Project
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Fill out the form below and our team will contact you soon to
                discuss your project requirements.
              </Typography>
            </Box>

            <Stepper
              activeStep={activeStep}
              sx={{ mb: 4, px: { xs: 0, md: 4 } }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {submitted ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Send
                  sx={{
                    fontSize: 60,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  color="success.main"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Thank You!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ mb: 3, maxWidth: 500, mx: "auto" }}
                >
                  We have received your request. Our team will contact you
                  within 24 hours to discuss your project requirements.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowForm(false);
                    setSubmitted(false);
                    setActiveStep(0);
                  }}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Close
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box sx={{ flexGrow: 1 }}>
                  {activeStep === 0 && (
                    <Fade in={activeStep === 0} timeout={500}>
                      <Stack spacing={3}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Name"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              required
                              fullWidth
                              disabled
                              InputProps={{
                                startAdornment: (
                                  <Person
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                ),
                              }}
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
                              InputProps={{
                                startAdornment: (
                                  <Email
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                ),
                              }}
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
                              InputProps={{
                                startAdornment: (
                                  <Phone
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="University/Institution"
                              name="university"
                              value={form.university}
                              onChange={handleChange}
                              required
                              fullWidth
                              disabled
                              InputProps={{
                                startAdornment: (
                                  <School
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Project Type"
                              name="type"
                              value={form.type}
                              onChange={handleChange}
                              required
                              fullWidth
                              placeholder="Academic / Personal"
                              InputProps={{
                                startAdornment: (
                                  <Assignment
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel>Project Category</InputLabel>
                              <Select
                                label="Project Category"
                                name="subject"
                                required
                                value={form.subject}
                                onChange={handleChange}
                                startAdornment={
                                  <Category
                                    sx={{ color: "action.active", mr: 1 }}
                                  />
                                }
                              >
                                <MenuItem value="App">App Development</MenuItem>
                                <MenuItem value="Web">Web Development</MenuItem>
                                <MenuItem value="ML">Machine Learning</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: 2,
                              }}
                            >
                              <TextField
                                label="Deadline"
                                name="deadline"
                                type="date"
                                value={form.deadline}
                                onChange={handleChange}
                                required
                                sx={{ flexGrow: 1 }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                  startAdornment: (
                                    <CalendarToday
                                      sx={{ color: "action.active", mr: 1 }}
                                    />
                                  ),
                                }}
                              />
                              {form.deadline && (
                                <Chip
                                  label={
                                    daysLeft < 0
                                      ? "Invalid date"
                                      : daysLeft === 0
                                      ? "Today! - Tight deadline!"
                                      : `${daysLeft} day${
                                          daysLeft > 1 ? "s" : ""
                                        } left`
                                  }
                                  color={
                                    daysLeft < 0
                                      ? "error"
                                      : daysLeft < 3
                                      ? "warning"
                                      : daysLeft < 7
                                      ? "info"
                                      : "success"
                                  }
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </Box>
                            {form.deadline && daysLeft >= 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  mt: 1,
                                  color:
                                    daysLeft < 3
                                      ? "warning.main"
                                      : daysLeft < 7
                                      ? "info.main"
                                      : "success.main",
                                  fontWeight: 500,
                                }}
                              >
                                {daysLeft < 3
                                  ? "This is a tight deadline. We'll do our best!"
                                  : daysLeft < 7
                                  ? "This is a manageable timeline."
                                  : "You have plenty of time for this project."}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <TextField
                                label="Project Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={8}
                                placeholder="Describe your project requirements, features, or any special instructions..."
                                variant="outlined"
                                sx={{
                                  width: { xs: "100%", sm: 600, md: 800 },
                                  background: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "#232b36"
                                      : "#f9f9f9",
                                  borderRadius: 3,
                                  "& .MuiInputBase-input": {
                                    fontSize: 16,
                                    lineHeight: 1.7,
                                    color: "text.primary",
                                    paddingTop: "12px",
                                    paddingBottom: "12px",
                                  },
                                }}
                                inputProps={{ maxLength: 1000 }}
                                helperText={`${form.description.length}/1000 characters`}
                                InputProps={{
                                  startAdornment: (
                                    <Description
                                      sx={{
                                        color: "action.active",
                                        mr: 1,
                                        alignSelf: "flex-start",
                                        mt: 1.5,
                                      }}
                                    />
                                  ),
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            onClick={() => setActiveStep(1)}
                            disabled={
                              !form.type ||
                              !form.subject ||
                              !form.deadline ||
                              !form.description
                            }
                            sx={{
                              borderRadius: 3,
                              px: 5,
                              py: 1.5,
                              fontWeight: 600,
                              fontSize: 16,
                            }}
                          >
                            Continue to Review
                          </Button>
                        </Box>
                      </Stack>
                    </Fade>
                  )}

                  {activeStep === 1 && (
                    <Fade in={activeStep === 1} timeout={500}>
                      <Stack spacing={3}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="text.primary"
                        >
                          Review Your Request
                        </Typography>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: isDarkMode
                              ? "grey.900"
                              : "grey.50",
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Name
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Email
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.email}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Phone
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.phone}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                University
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.university}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Project Type
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.type}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Category
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.subject}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Deadline
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                color="text.primary"
                              >
                                {form.deadline}{" "}
                                {daysLeft >= 0 && `(${daysLeft} days)`}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Project Description
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ mt: 1 }}
                                color="text.primary"
                              >
                                {form.description}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>

                        {error && (
                          <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                          </Alert>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => setActiveStep(0)}
                            sx={{ borderRadius: 3, px: 4 }}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{
                              borderRadius: 3,
                              px: 5,
                              py: 1.5,
                              fontWeight: 600,
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                            }}
                          >
                            Submit Request
                          </Button>
                        </Box>
                      </Stack>
                    </Fade>
                  )}
                </Box>
              </form>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
