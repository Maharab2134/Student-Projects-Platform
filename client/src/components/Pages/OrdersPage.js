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
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import Tilt from "react-parallax-tilt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Rating from "@mui/material/Rating";
import axios from "axios";

const steps = [
  {
    label: "Pending",
    description: "Waiting for payment confirmation",
    color: "warning",
    icon: <HourglassEmptyIcon color="warning" />,
  },
  {
    label: "Accepted",
    description: "Payment received",
    color: "info",
    icon: <PaymentIcon color="info" />,
  },
  {
    label: "Rejected",
    description: "Payment not received or canceled",
    color: "error",
    icon: <ErrorIcon color="error" />,
  },
  {
    label: "Working",
    description: "Project in progress",
    color: "primary",
    icon: <WorkIcon color="primary" />,
  },
  {
    label: "Delivery",
    description: "Ready for delivery in 2-3 days",
    color: "success",
    icon: <LocalShippingIcon color="success" />,
  },
  {
    label: "Complete",
    description: "Project completed",
    color: "success",
    icon: <DoneAllIcon color="success" />,
  },
];

export default function OrdersPage({ myOrders, user }) {
  const [openStatusTree, setOpenStatusTree] = React.useState(false);
  const [ratings, setRatings] = React.useState({});

  const handleRate = async (orderId, newValue) => {
    setRatings((prev) => ({ ...prev, [orderId]: newValue }));
    try {
      await axios.post(
        `http://localhost:5000/api/order/${orderId}/rate`,
        { rating: newValue },
        { headers: { Authorization: user.token } }
      );
    } catch (err) {
      alert("Failed to save rating");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        align="center"
        sx={{ mb: 2, color: "primary.main" }}
      >
        My Orders
      </Typography>

      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
          border: "1px solid #e0e0e0",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography fontWeight={700} sx={{ mb: 0, textAlign: "center" }}>
            Order Status Flow
          </Typography>
          <IconButton
            size="small"
            onClick={() => setOpenStatusTree((prev) => !prev)}
            sx={{ ml: 1 }}
            aria-label={openStatusTree ? "Hide" : "Show"}
          >
            {openStatusTree ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={openStatusTree}>
          <Stepper orientation="vertical" activeStep={-1} sx={{ pl: 0, mt: 1 }}>
            {steps.map((step) => (
              <Step key={step.label} sx={{ pl: 0 }}>
                <StepLabel
                  icon={step.icon}
                  sx={{
                    ".MuiStepLabel-label": {
                      fontWeight: 600,
                      color: `${step.color}.main`,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={step.label}
                      color={step.color}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Typography variant="body2" component="span">
                      {step.description}
                    </Typography>
                  </Stack>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Collapse>
      </Box>

      {myOrders.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          You have no orders yet.
        </Typography>
      )}
      <Grid container spacing={7} sx={{ mt: 3 }}>
        {myOrders.map((o) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={o._id}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.15}
              scale={1.04}
              transitionSpeed={100}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              style={{ height: "100%" }}
            >
              <Box
                sx={{
                  border: "1px solid #e3e3e3",
                  borderRadius: 3,
                  boxShadow: 2,
                  p: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "background.paper",
                  height: "100%",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Project Image (first project) */}
                {o.projects[0] && (
                  <Tooltip title={o.projects[0].title}>
                    <Avatar
                      variant="rounded"
                      src={o.projects[0].img}
                      alt={o.projects[0].title}
                      sx={{
                        width: 66,
                        height: 66,
                        border: "1px solid #e0e0e0",
                        bgcolor: "#f5f5f5",
                        mb: 0.5,
                      }}
                    />
                  </Tooltip>
                )}
                <Typography fontWeight={700} sx={{ mb: 0.2, fontSize: 16 }}>
                  Order #{o._id.slice(-6).toUpperCase()}
                </Typography>
                <Typography
                  color="text.secondary"
                  fontSize={13}
                  sx={{ mb: 0.2 }}
                >
                  {new Date(o.createdAt).toLocaleString()}
                </Typography>
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
                      : o.status === "Delivery" || o.status === "Complete"
                      ? "success"
                      : "default"
                  }
                  size="small"
                  sx={{ fontWeight: 700, mb: 0.2 }}
                />
                <Typography
                  fontSize={13}
                  color="text.secondary"
                  sx={{ mb: 0.2 }}
                >
                  {o.paymentMethod}
                </Typography>
                <Typography
                  fontWeight={700}
                  color="primary"
                  sx={{ mt: 0.5, fontSize: 15 }}
                >
                  Total: BDT {o.total}k
                </Typography>
                {/* User Rating */}
                {["Delivery", "Complete"].includes(o.status) && (
                  <>
                    <Rating
                      name={`order-rating-${o._id}`}
                      value={ratings[o._id] || o.rating || 0}
                      onChange={(_, newValue) => handleRate(o._id, newValue)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {ratings[o._id] || o.rating
                        ? `You rated: ${ratings[o._id] || o.rating} star${
                            (ratings[o._id] || o.rating) > 1 ? "s" : ""
                          }`
                        : "Rate this order"}
                    </Typography>
                  </>
                )}
                <Typography variant="caption" color="text.secondary">
                  {ratings[o._id] || o.rating
                    ? `You rated: ${ratings[o._id] || o.rating} star${
                        (ratings[o._id] || o.rating) > 1 ? "s" : ""
                      }`
                    : "Rate this order"}
                </Typography>
              </Box>
            </Tilt>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
