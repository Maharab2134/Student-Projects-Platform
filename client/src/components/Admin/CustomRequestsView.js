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
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Email,
  Phone,
  School,
  Event,
  Description,
  Fingerprint,
  CheckCircle,
  Pending,
  Cancel,
  ArrowForward,
  Delete,
} from "@mui/icons-material";
import AppsIcon from "@mui/icons-material/Apps";
import LanguageIcon from "@mui/icons-material/Language";
import axios from "axios";

const statusConfig = {
  Pending: {
    color: "warning",
    icon: <Pending color="warning" />,
  },
  "In Progress": {
    color: "info",
    icon: <ArrowForward color="info" />,
  },
  Completed: {
    color: "success",
    icon: <CheckCircle color="success" />,
  },
  Rejected: {
    color: "error",
    icon: <Cancel color="error" />,
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -20 },
};

export default function AdminCustomRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (user?.isAdmin) {
      const fetchRequests = () => {
        setLoading(true);
        axios
          .get(`${API}/admin/requests`, {
            headers: { Authorization: user.token },
          })
          .then((res) => {
            setRequests(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      };
      fetchRequests();
    }
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/request/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: user.token } }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteRequest = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}admin/request/${id}`, {
        headers: { Authorization: user.token },
      });
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error("Failed to delete request:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4, px: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb: 4,
          textAlign: "center",
          color: "primary.main",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 4,
            bgcolor: "primary.main",
            borderRadius: 2,
          },
        }}
      >
        Custom Project Requests
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : requests.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
            alt="No requests"
            width={150}
            style={{ opacity: 0.7 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 400,
              mx: "auto",
            }}
          >
            No custom project requests found. Check back later!
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div
                key={req._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    borderLeft: `4px solid ${
                      theme.palette[statusConfig[req.status]?.color] ||
                      theme.palette.grey[500]
                    }`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: theme.shadows[6],
                      borderLeftWidth: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                    }}
                  >
                    {/* User Info Section */}
                    <Box sx={{ minWidth: 280 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {req.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{req.name}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Email fontSize="small" />
                            {req.email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Fingerprint fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            ID: {req._id.slice(-8)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {req.phone || "Not provided"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <School fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {req.university || "Not provided"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Event fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {req.deadline || "Flexible"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Request Details Section */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {req.subject === "App" ? (
                          <AppsIcon color="primary" />
                        ) : req.subject === "Web" ? (
                          <LanguageIcon color="primary" />
                        ) : (
                          <Description color="primary" />
                        )}
                        {req.subject}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          p: 2,
                          borderRadius: 1,
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                          borderRight: `3px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        "{req.description}"
                      </Typography>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Chip
                          icon={<Event fontSize="small" />}
                          label={new Date(req.createdAt).toLocaleString()}
                          size="small"
                          variant="outlined"
                        />

                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Update Status</InputLabel>
                            <Select
                              value={req.status || "Pending"}
                              label="Update Status"
                              onChange={(e) =>
                                handleStatusChange(req._id, e.target.value)
                              }
                            >
                              {Object.keys(statusConfig).map((status) => (
                                <MenuItem key={status} value={status}>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    {statusConfig[status].icon}
                                    {status}
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <Tooltip title="Delete request">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteRequest(req._id)}
                              disabled={deletingId === req._id}
                            >
                              {deletingId === req._id ? (
                                <CircularProgress size={24} />
                              ) : (
                                <Delete />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      )}
    </Box>
  );
}
