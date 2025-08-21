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
  Fade,
  Zoom,
  Slide,
  alpha,
  useMediaQuery,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { keyframes } from "@emotion/react";

const API = process.env.REACT_APP_API; // Ensure this is set in your .env file

// Animation for cards
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Pulse animation for empty state
const pulseAnimation = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const statusChip = (status, theme) => {
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
      sx={{
        fontWeight: 600,
        letterSpacing: 1,
        boxShadow: theme.shadows[1],
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: theme.shadows[4],
        },
      }}
    />
  );
};

export default function MyCustomRequests({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API}/myrequests`, {
          headers: { Authorization: user.token },
        })
        .then((res) => {
          // Simulate loading delay for animation demonstration
          setTimeout(() => {
            setRequests(res.data);
            setLoading(false);
          }, 800);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 4,
        px: isMobile ? 1 : 2,
        minHeight: "60vh",
      }}
    >
      <Fade in={true} timeout={800}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={800}
          color="primary"
          sx={{
            mb: 4,
            textAlign: "center",
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <PsychologyIcon sx={{ fontSize: isMobile ? "2rem" : "2.5rem" }} />
          My Custom Project Requests
        </Typography>
      </Fade>

      {loading ? (
        <Box
          sx={{
            textAlign: "center",
            my: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zoom
            in={loading}
            style={{ transitionDelay: loading ? "200ms" : "0ms" }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
          </Zoom>
          <Typography variant="body2" color="text.secondary">
            Loading your requests...
          </Typography>
        </Box>
      ) : requests.length === 0 ? (
        <Fade in={true} timeout={600}>
          <Box
            sx={{
              textAlign: "center",
              color: "text.secondary",
              mt: 8,
              animation: `${pulseAnimation} 3s ease-in-out infinite`,
              p: 3,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No requests"
              width={isMobile ? 80 : 120}
              style={{
                opacity: 0.7,
                marginBottom: 16,
                filter: theme.palette.mode === "dark" ? "invert(0.7)" : "none",
              }}
            />
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 1 }}>
              You have not submitted any custom project requests yet.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Get started by creating your first custom project request!
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {requests.map((req, index) => (
            <Grid item xs={12} sm={6} key={req._id}>
              <Slide
                direction="up"
                in={true}
                timeout={500}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: isMobile ? 2 : 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    minHeight: isMobile ? 180 : 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    bgcolor: theme.palette.background.paper,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                      animation: `${floatAnimation} 3s ease-in-out infinite`,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    {statusChip(req.status, theme)}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {req.type}
                    </Typography>
                  </Stack>

                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight={700}
                    sx={{
                      color: "primary.main",
                      mb: 1,
                      letterSpacing: 0.5,
                      lineHeight: 1.3,
                      minHeight: isMobile ? "auto" : "3rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {req.subject}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 2,
                      minHeight: isMobile ? 40 : 48,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      opacity: 0.9,
                      lineHeight: 1.5,
                    }}
                  >
                    {req.description}
                  </Typography>

                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={isMobile ? 1 : 2}
                    alignItems={isMobile ? "flex-start" : "center"}
                    sx={{ mt: "auto" }}
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
                        Submitted:{" "}
                        {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Slide>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
