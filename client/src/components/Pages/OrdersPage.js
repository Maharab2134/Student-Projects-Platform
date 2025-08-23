import React from "react";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Stack,
  IconButton,
  Collapse,
  Card,
  CardContent,
  TextField,
  Button,
  LinearProgress,
  useTheme,
  useMediaQuery,
  styled,
  Rating,
} from "@mui/material";
import {
  HourglassEmpty,
  Error,
  LocalShipping,
  DoneAll,
  Work,
  Payment,
  ExpandMore,
  ExpandLess,
  Star,
  RateReview,
  CalendarToday,
} from "@mui/icons-material";
import axios from "axios";

// Glassmorphism Card
const GlassCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(30, 32, 40, 0.55)"
      : "rgba(255,255,255,0.55)",
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px 0 rgba(0,0,0,0.45)"
      : "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.18)",
  transition: "box-shadow 0.3s, transform 0.3s",
  "&:hover": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 16px 32px 0 rgba(0,0,0,0.65)"
        : "0 16px 32px 0 rgba(31, 38, 135, 0.25)",
    transform: "translateY(-4px) scale(1.02)",
  },
}));

const StyledRating = styled(Box)(({ theme }) => ({
  "& .MuiRating-icon": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    color: theme.palette.grey[400],
  },
  "& .Mui-disabled": {
    "& .MuiRating-icon": {
      color: theme.palette.warning.main,
    },
  },
}));

const steps = [
  {
    label: "Pending",
    description: "Waiting for payment confirmation",
    color: "warning",
    icon: <HourglassEmpty color="warning" />,
  },
  {
    label: "Accepted",
    description: "Payment received",
    color: "info",
    icon: <Payment color="info" />,
  },
  {
    label: "Rejected",
    description: "Payment not received or canceled",
    color: "error",
    icon: <Error color="error" />,
  },
  {
    label: "Working",
    description: "Project in progress",
    color: "primary",
    icon: <Work color="primary" />,
  },
  {
    label: "Delivery",
    description: "Ready for delivery in 2-3 days",
    color: "success",
    icon: <LocalShipping color="success" />,
  },
  {
    label: "Complete",
    description: "Project completed",
    color: "success",
    icon: <DoneAll color="success" />,
  },
];

export default function OrdersPage({ myOrders, setMyOrders, user }) {
  const [openStatusTree, setOpenStatusTree] = React.useState(false);
  const [ratings, setRatings] = React.useState({});
  const [reviews, setReviews] = React.useState({});
  const [reviewLoading, setReviewLoading] = React.useState({});
  const [expandedTitles, setExpandedTitles] = React.useState({});
  const API = process.env.REACT_APP_API;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Only update local state for rating
  const handleRate = (orderId, newValue) => {
    setRatings((prev) => ({ ...prev, [orderId]: newValue }));
  };

  const getStatusIndex = (status) => {
    return steps.findIndex((step) => step.label === status);
  };

  // Submit both review and rating together
  const handleReviewSubmit = async (orderId) => {
    if (!reviews[orderId] || !reviews[orderId].trim()) return;
    if (!ratings[orderId]) {
      alert("Please provide a rating before submitting your review.");
      return;
    }
    setReviewLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axios.post(
        `${API}/order/${orderId}/review`,
        {
          review: reviews[orderId],
          rating: ratings[orderId],
        },
        { headers: { Authorization: user.token } }
      );

      setMyOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, review: reviews[orderId], rating: ratings[orderId] }
            : order
        )
      );
      setReviews((prev) => ({ ...prev, [orderId]: "" }));
    } catch {
      alert("Failed to submit review");
    }
    setReviewLoading((prev) => ({ ...prev, [orderId]: false }));
  };

  // Toggle title expand/collapse
  const handleToggleTitle = (orderId) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: isMobile ? 1 : 4,
        background: theme.palette.background.default,
        fontFamily: "Inter, Roboto, Arial, sans-serif",
      }}
    >
      {/* Page title */}
      <Typography
        variant="h4"
        fontWeight={600}
        align="center"
        sx={{
          mb: 5,
          letterSpacing: 1,
          color: theme.palette.text.primary,
          textShadow:
            theme.palette.mode === "dark"
              ? "0 2px 12px rgba(0,0,0,0.25)"
              : "0 2px 12px rgba(30, 64, 175, 0.08)",
        }}
      >
        My Orders
      </Typography>

      {/* Status Flow Section */}
      <GlassCard
        sx={{
          mb: 5,
          borderRadius: 2,
          maxWidth: 420,
          mx: "auto",
          p: 0.2,
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ cursor: "pointer", mt: 1 }}
            onClick={() => setOpenStatusTree((prev) => !prev)}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                textAlign: "center",
                background: "linear-gradient(90deg, #0f2027 0%, #2c5364 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              Order Status Flow Guide
            </Typography>
            <IconButton
              size="small"
              sx={{ ml: 0.5, color: "text.secondary" }}
              aria-label={openStatusTree ? "Hide" : "Show"}
            >
              {openStatusTree ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={openStatusTree}>
            <Stepper
              orientation="vertical"
              activeStep={-1}
              sx={{
                pl: 5,
                mt: 1,
                "& .MuiStepLabel-label": {
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
                "& .MuiStepConnector-root": {
                  minHeight: 12,
                },
              }}
            >
              {steps.map((step) => (
                <Step key={step.label} sx={{ pl: 0 }}>
                  <StepLabel
                    icon={React.cloneElement(step.icon, {
                      sx: { fontSize: 24 },
                    })}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Chip
                        label={step.label}
                        color={step.color}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                      />
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                      >
                        {step.description}
                      </Typography>
                    </Stack>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Collapse>
        </CardContent>
      </GlassCard>

      {/* Empty State */}
      {myOrders.length === 0 && (
        <GlassCard
          sx={{
            textAlign: "center",
            mt: 10,
            p: 4,
            borderRadius: 4,
            maxWidth: 500,
            mx: "auto",
          }}
        >
          <LocalShipping
            sx={{ fontSize: 60, color: theme.palette.info.light, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your orders will appear here once you make a purchase.
          </Typography>
        </GlassCard>
      )}

      {/* Orders Grid */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {myOrders.map((o) => {
          const statusIndex = getStatusIndex(o.status);
          const projectTitle = o.projects[0]?.title || "";
          const isTitleLong = projectTitle.length >20;
          return (
            <Grid item xs={12} sm={6} md={3} key={o._id}>
              <GlassCard
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  p: 3,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 32px 0 rgba(0,0,0,0.45)"
                      : "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                  overflow: "visible",
                  minHeight: 420,
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image on top, then title, then date */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    {/* Project Image (on top) */}
                    {o.projects[0] && (
                      <Box
                        sx={{
                          width: 102,
                          height: 102,
                          border: `2px solid ${theme.palette.info.light}`,
                          bgcolor: "#f5f5f5",
                          mb: 1.5,
                          boxShadow: 2,
                          borderRadius: 1,
                          overflow: "hidden", // prevents overflow
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={o.projects[0].img}
                          alt={projectTitle}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain", // ensures full image is visible
                          }}
                        />
                      </Box>
                    )}

                    {/* Project Title (truncated, expandable) */}
                    <Tooltip
                      arrow
                      title={
                        isTitleLong && !expandedTitles[o._id]
                          ? projectTitle
                          : ""
                      }
                      disableHoverListener={expandedTitles[o._id]}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mb: 0.5,
                          maxWidth: 200,
                          cursor: isTitleLong ? "pointer" : "default",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: expandedTitles[o._id]
                            ? "normal"
                            : "nowrap",
                          wordBreak: "break-word",
                          textAlign: "left",
                          transition: "all 0.2s",
                          color: theme.palette.text.primary,
                          position: "relative",
                        }}
                        onClick={() => {
                          if (isTitleLong) handleToggleTitle(o._id);
                        }}
                      >
                        {projectTitle}
                        {isTitleLong && (
                          <span
                            style={{
                              color: "#1976d2",
                              fontWeight: 600,
                              fontSize: "0.9em",
                              marginLeft: 6,
                              cursor: "pointer",
                            }}
                          >
                            {expandedTitles[o._id] ? ".." : " .."}
                          </span>
                        )}
                      </Typography>
                    </Tooltip>

                    {/* Date */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                        fontSize: 14,
                        mt: 0.5,
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {new Date(o.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status and progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={o.status}
                        color={
                          o.status === "Pending"
                            ? "warning"
                            : o.status === "Accepted"
                            ? "info"
                            : o.status === "Rejected"
                            ? "error"
                            : o.status === "Working"
                            ? "primary"
                            : ["Delivery", "Complete"].includes(o.status)
                            ? "success"
                            : "default"
                        }
                        size="small"
                        sx={{ fontWeight: 700, fontSize: 14, px: 1.5 }}
                      />

                      <Typography variant="body2" color="text.secondary">
                        {o.paymentMethod}
                      </Typography>
                    </Box>

                    {!["Rejected", "Complete"].includes(o.status) && (
                      <LinearProgress
                        variant="determinate"
                        value={(statusIndex / (steps.length - 1)) * 100}
                        sx={{
                          height: 7,
                          borderRadius: 3,
                          mt: 1,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(144,202,249,0.10)"
                              : "rgba(144,202,249,0.15)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              o.status === "Pending"
                                ? theme.palette.warning.main
                                : o.status === "Accepted"
                                ? theme.palette.info.main
                                : o.status === "Working"
                                ? theme.palette.primary.main
                                : theme.palette.success.main,
                          },
                        }}
                      />
                    )}
                  </Box>

                  {/* Order total */}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 0.3,
                      mb: 1,
                      textAlign: "center",
                      fontWeight: 800,
                      letterSpacing: 1,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Total: BDT {o.total}k
                  </Typography>

                  {/* User Rating (only on Delivery or Complete) */}
                  {["Delivery", "Complete"].includes(o.status) && (
                    <Box sx={{ mt: "auto" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <Star color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight={600}>
                          Rate your experience
                        </Typography>
                      </Box>

                      <StyledRating
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <Rating
                          name={`order-rating-${o._id}`}
                          value={
                            o.review
                              ? o.rating // If already reviewed, show saved rating
                              : ratings[o._id] || 0 // Else, show selected rating
                          }
                          onChange={(_, newValue) => {
                            if (!o.review) {
                              handleRate(o._id, newValue);
                            }
                          }}
                          size="medium"
                          disabled={Boolean(o.review)}
                        />
                      </StyledRating>

                      {/* Review Box */}
                      {!o.review ? (
                        <Box sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <RateReview
                              color="action"
                              sx={{ mr: 1, fontSize: 20 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Share your feedback
                            </Typography>
                          </Box>
                          <TextField
                            multiline
                            rows={3}
                            fullWidth
                            value={reviews[o._id] || ""}
                            onChange={(e) =>
                              setReviews((prev) => ({
                                ...prev,
                                [o._id]: e.target.value,
                              }))
                            }
                            disabled={reviewLoading[o._id]}
                            placeholder="Tell us about your experience with this order..."
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 500 }}
                            sx={{
                              background:
                                theme.palette.mode === "dark"
                                  ? "rgba(30,32,40,0.7)"
                                  : "rgba(255,255,255,0.7)",
                              borderRadius: 2,
                            }}
                          />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={0.5}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {reviews[o._id] ? reviews[o._id].length : 0}/500
                              characters
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleReviewSubmit(o._id)}
                              disabled={
                                reviewLoading[o._id] ||
                                !reviews[o._id] ||
                                !reviews[o._id].trim() ||
                                !ratings[o._id] // Disable if no rating
                              }
                              sx={{ borderRadius: 2 }}
                            >
                              {reviewLoading[o._id]
                                ? "Submitting..."
                                : "Submit"}
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            mt: 1,
                            p: 2,
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "rgba(144,202,249,0.10)"
                                : "rgba(144,202,249,0.10)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                          >
                            Your Review
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic" }}
                          >
                            "{o.review}"
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </GlassCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
