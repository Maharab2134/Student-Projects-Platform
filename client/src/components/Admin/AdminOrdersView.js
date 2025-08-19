import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Tooltip,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Status color helper
const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Accepted":
      return "info";
    case "Rejected":
      return "error";
    case "Working":
      return "primary";
    case "Delivery":
      return "success";
    case "Complete":
      return "success";
    default:
      return "default";
  }
};

// Status explanations
const statusExplanation = {
  Pending: "Waiting for payment confirmation",
  Accepted: "Payment received",
  Rejected: "Payment not received or canceled",
  Working: "Project in progress",
  Delivery: "Ready for delivery in 2-3 days",
  Complete: "Project completed",
};

// Only the normal flow, "Rejected" is not in the flow
const statusFlow = ["Pending", "Accepted", "Working", "Delivery", "Complete"];

export default function AdminOrdersView({
  adminOrders,
  onNextStage,
  onDeleteOrder,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={800}
        align="center"
        sx={{ mb: 4, color: "primary.main" }}
      >
        All Orders
      </Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Tran ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminOrders.map((o) => {
              const currentIndex = statusFlow.indexOf(o.status);
              const nextStatus =
                currentIndex >= 0 && currentIndex < statusFlow.length - 1
                  ? statusFlow[currentIndex + 1]
                  : null;
              return (
                <TableRow key={o._id}>
                  <TableCell>{o.userId}</TableCell>
                  <TableCell>
                    {o.projects.map((p) => p.title).join(", ")}
                  </TableCell>
                  <TableCell>{o.rating}</TableCell>
                  <TableCell>BDT {o.total}k</TableCell>
                  <TableCell>{o.paymentMethod}</TableCell>
                  <TableCell>{o.transactionId}</TableCell>
                  <TableCell>
                    <Tooltip title={statusExplanation[o.status] || ""}>
                      <Chip
                        label={o.status}
                        color={statusColor(o.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {o.status === "Pending" ? (
                        <>
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => onNextStage(o._id, "Accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => onNextStage(o._id, "Rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          {nextStatus &&
                            o.status !== "Complete" &&
                            o.status !== "Rejected" && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => onNextStage(o._id, nextStatus)}
                                sx={{ mr: 1 }}
                              >
                                Next: {nextStatus}
                              </Button>
                            )}
                        </>
                      )}
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDeleteOrder(o._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
