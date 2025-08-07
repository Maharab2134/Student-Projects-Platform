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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

// Status color helper
const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Accepted": //payment received
      return "info";
    case "Rejected": //payment not received
      return "error";
    case "Working": //in progress
      return "primary";
    case "Delivery": //ready for delivery
      return "success";
    case "Complete": //completed
      return "success";
    default:
      return "default";
  }
};

const statusFlow = [
  "Pending",
  "Accepted",
  "Rejected",
  "Working",
  "Delivery",
  "Complete",
];

export default function AdminOrdersView({ adminOrders, onNextStage, onDeleteOrder }) {
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Projects</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Tran ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminOrders.map((o) => (
            <TableRow key={o._id}>
              <TableCell>{o.userId}</TableCell>
              <TableCell>{o.projects.map((p) => p.title).join(", ")}</TableCell>
              <TableCell>BDT {o.total}k</TableCell>
              <TableCell>{o.paymentMethod}</TableCell>
              <TableCell>{o.transactionId}</TableCell>
              <TableCell>
                <Chip
                  label={o.status}
                  color={statusColor(o.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {o.status !== "Complete" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        const currentIndex = statusFlow.indexOf(o.status);
                        const nextStatus = statusFlow[currentIndex + 1];
                        if (nextStatus) onNextStage(o._id, nextStatus);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Next Stage
                    </Button>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => onDeleteOrder(o._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
