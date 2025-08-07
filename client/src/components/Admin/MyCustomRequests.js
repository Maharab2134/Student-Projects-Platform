import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Grid,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const statusChip = (status) => {
  let color = "default";
  let icon = <HourglassEmptyIcon fontSize="small" />;
  if (status === "Completed") {
    color = "success";
    icon = <DoneAllIcon fontSize="small" />;
  } else if (status === "Rejected") {
    color = "error";
    icon = <ErrorOutlineIcon fontSize="small" />;
  } else if (status === "In Progress") {
    color = "warning";
    icon = <AssignmentTurnedInIcon fontSize="small" />;
  }
  return (
    <Chip
      icon={icon}
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 600, letterSpacing: 1 }}
    />
  );
};
export default function MyCustomRequests({ user }) {
  const theme = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/myrequests", {
          headers: { Authorization: user.token },
        })
        .then((res) => {
          setRequests(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4, px: 2 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        color="primary"
        sx={{ mb: 4, textAlign: "center", letterSpacing: 1 }}
      >
        My Custom Project Requests
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", my: 6 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Box sx={{ textAlign: "center", color: "text.secondary", mt: 8 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No requests"
            width={120}
            style={{ opacity: 0.5, marginBottom: 16 }}
          />
          <Typography variant="h6">
            You have not submitted any custom project requests yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {requests.map((req) => (
            <Grid item xs={12} sm={6} key={req._id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  {statusChip(req.status)}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, fontWeight: 500 }}
                  >
                    {req.type}
                  </Typography>
                </Stack>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "primary.main", mb: 1, letterSpacing: 0.5 }}
                >
                  {req.subject}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 1,
                    minHeight: 48,
                  }}
                >
                  {req.description}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Deadline: {req.deadline}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Submitted: {new Date(req.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
