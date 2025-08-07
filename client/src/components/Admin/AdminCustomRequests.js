import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

const statusColors = {
  Pending: "default",
  "In Progress": "warning",
  Completed: "success",
  Rejected: "error",
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 80 },
  }),
};

export default function AdminCustomRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (user?.isAdmin) {
      axios
        .get("http://localhost:5000/api/admin/requests", {
          headers: { Authorization: user.token },
        })
        .then((res) => {
          setRequests(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/request/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: user.token } }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", my: 4, px: 2 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb: 4,
          textAlign: "center",
          letterSpacing: 1,
          color: theme.palette.mode === "dark" ? "#fff" : "primary.main",
        }}
      >
        Custom Project Requests
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", my: 6 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No requests"
            width={120}
            style={{ opacity: 0.5, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            No custom project requests found.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {requests.map((req, i) => (
            <motion.div
              key={req._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.02,
                boxShadow: theme.shadows[8],
              }}
              style={{ borderRadius: 16 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { md: "center" },
                  justifyContent: "space-between",
                  gap: 3,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "box-shadow 0.3s, border 0.3s",
                  "&:hover": {
                    border: `1.5px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <Stack spacing={1} sx={{ minWidth: 260 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography fontWeight={700}>{req.name}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FingerprintIcon color="action" fontSize="small" />
                    <Typography fontWeight={700}>{req._id}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {req.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {req.phone}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SchoolIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {req.university}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DescriptionIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {req.subject}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Deadline: {req.deadline}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Chip
                      label={new Date(req.createdAt).toLocaleString()}
                      size="small"
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : theme.palette.grey[200],
                        color: theme.palette.text.primary,
                      }}
                    />
                    <Chip
                      label={req.status || "Pending"}
                      color={statusColors[req.status] || "default"}
                      size="small"
                      sx={{ fontWeight: 600, letterSpacing: 1 }}
                    />
                  </Stack>
                </Stack>

                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 2,
                      fontStyle: "italic",
                      fontSize: 16,
                      minHeight: 48,
                    }}
                  >
                    "{req.description}"
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={req.status || "Pending"}
                      label="Status"
                      onChange={(e) =>
                        handleStatusChange(req._id, e.target.value)
                      }
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Stack>
      )}
    </Box>
  );
}
