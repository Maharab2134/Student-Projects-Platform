import React from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
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

// Custom styled rating component with fixed colors
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
  const API = process.env.REACT_APP_API;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRate = async (orderId, newValue) => {
    setRatings((prev) => ({ ...prev, [orderId]: newValue }));
    try {
      await axios.post(
        `${API}/order/${orderId}/rate`,
        { rating: newValue },
        { headers: { Authorization: user.token } }
      );
    } catch {
      alert("Failed to save rating");
    }
  };

  const getStatusIndex = (status) => {
    return steps.findIndex((step) => step.label === status);
  };
  const handleReviewSubmit = async (orderId) => {
    if (!reviews[orderId] || !reviews[orderId].trim()) return;
    setReviewLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axios.post(
        `${API}/order/${orderId}/review`,
        { review: reviews[orderId] },
        { headers: { Authorization: user.token } }
      );

      setMyOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, review: reviews[orderId] } : order
        )
      );
      setReviews((prev) => ({ ...prev, [orderId]: "" }));
    } catch {
      alert("Failed to submit review");
    }
    setReviewLoading((prev) => ({ ...prev, [orderId]: false }));
  };
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: isMobile ? 2 : 3 }}>
      {/* Page title */}
      <Typography
        variant="h4"
        fontWeight={700}
        align="center"
        sx={{
          mb: 3,
          color: "primary.main",
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        My Orders
      </Typography>

      {/* Status Flow Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          background: "linear-gradient(to bottom, #ffffff, #f8fbff)",
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenStatusTree((prev) => !prev)}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ textAlign: "center", color: "primary.dark" }}
            >
              Order Status Flow Guide
            </Typography>
            <IconButton
              size="small"
              sx={{ ml: 1, color: "primary.main" }}
              aria-label={openStatusTree ? "Hide" : "Show"}
            >
              {openStatusTree ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={openStatusTree}>
            <Stepper
              orientation="vertical"
              activeStep={-1}
              sx={{ pl: 0, mt: 2 }}
            >
              {steps.map((step, index) => (
                <Step key={step.label} sx={{ pl: 0 }}>
                  <StepLabel
                    icon={React.cloneElement(step.icon, {
                      sx: { fontSize: 28 },
                    })}
                    sx={{
                      ".MuiStepLabel-label": {
                        fontWeight: 600,
                        color: `${step.color}.main`,
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Chip
                        label={step.label}
                        color={step.color}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          px: 1,
                          fontSize: "0.8rem",
                        }}
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
      </Card>

      {/* Empty State */}
      {myOrders.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 10,
            p: 4,
            borderRadius: 3,
            backgroundColor: "grey.50",
            maxWidth: 500,
            mx: "auto",
          }}
        >
          <LocalShipping sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your orders will appear here once you make a purchase.
          </Typography>
        </Box>
      )}

      {/* Orders Grid */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {myOrders.map((o) => {
          const statusIndex = getStatusIndex(o.status);
          return (
            <Grid item xs={12} sm={6} md={4} key={o._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  padding: 5,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  },
                  overflow: "visible",
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
                  {/* Order header with image and basic info */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    {/* Project Image (first project) */}
                    {o.projects[0] && (
                      <Tooltip title={o.projects[0].title} arrow>
                        <Avatar
                          variant="rounded"
                          src={o.projects[0].img}
                          alt={o.projects[0].title}
                          sx={{
                            width: 60,
                            height: 60,
                            border: "2px solid",
                            borderColor: "primary.light",
                            bgcolor: "#f5f5f5",
                            mr: 2,
                            boxShadow: 2,
                          }}
                        />
                      </Tooltip>
                    )}

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 0.5 }}
                      >
                        Order #{o._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {new Date(o.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
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
                        sx={{ fontWeight: 700 }}
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
                          height: 6,
                          borderRadius: 3,
                          mt: 1,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              o.status === "Pending"
                                ? "warning.main"
                                : o.status === "Accepted"
                                ? "info.main"
                                : o.status === "Working"
                                ? "primary.main"
                                : "success.main",
                          },
                        }}
                      />
                    )}
                  </Box>

                  {/* Order total */}
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 0.3, mb: 1, textAlign: "center" }}
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
                          value={ratings[o._id] || o.rating || 0}
                          onChange={(_, newValue) => {
                            if (!o.rating && !ratings[o._id]) {
                              handleRate(o._id, newValue);
                            }
                          }}
                          size="medium"
                          disabled={Boolean(o.rating || ratings[o._id])}
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
                                !reviews[o._id].trim()
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
                            bgcolor: "grey.50",
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
