import React, { useState } from "react";
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
  Avatar,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";

// Helper function to shorten institute name
function shortInstituteName(name) {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length > 3 || name.length > 24) {
    return words.slice(0, 3).join(" ") + "...";
  }
  return name;
}

export default function AdminUsersView({
  adminUsers,
  onViewUser,
  adminUserDetails,
  setAdminUserDetails,
  onDeleteUser,
  adminToken,
  API,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    success: true,
  });
  const [downloadLink, setDownloadLink] = useState("");

  // Email send handler
  const handleSendEmail = async () => {
    if (
      !adminUserDetails ||
      !adminUserDetails.user ||
      !adminUserDetails.orders.length
    )
      return;
    if (!downloadLink) {
      setSnackbar({
        open: true,
        msg: "Please provide a download link!",
        success: false,
      });
      return;
    }
    setSending(true);
    try {
      await axios.post(
        `${API}/admin/send-complete-mail`,
        {
          to: adminUserDetails.user.email,
          name: adminUserDetails.user.name,
          order: adminUserDetails.orders[0],
          downloadLink, // <-- পাঠানো হচ্ছে
        },
        {
          headers: { Authorization: adminToken },
        }
      );
      setSnackbar({
        open: true,
        msg: "Email sent successfully!",
        success: true,
      });
    } catch (err) {
      setSnackbar({ open: true, msg: "Failed to send email!", success: false });
    }
    setSending(false);
  };

  return (
    <Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={800}
        align="center"
        sx={{ mb: 4, color: "primary.main", letterSpacing: 1 }}
      >
        All Users
      </Typography>
      <Paper
        elevation={3}
        sx={{
          overflowX: "auto",
          borderRadius: 1,
          mb: 2,
          bgcolor:
            theme.palette.mode === "dark" ? "grey.900" : "background.paper",
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {!isMobile && <TableCell>User ID</TableCell>}
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {!isMobile && <TableCell>Institute</TableCell>}
              {!isMobile && <TableCell>Address</TableCell>}
              <TableCell>ID Number</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUsers.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  <Chip
                    avatar={
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    }
                    label={u.name}
                    sx={{
                      fontWeight: 600,
                      bgcolor:
                        theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    }}
                  />
                </TableCell>
                {!isMobile && <TableCell>{u._id}</TableCell>}
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                {/* Institute cell with ellipsis and tooltip */}
                {!isMobile && (
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 120,
                      cursor: "pointer",
                    }}
                  >
                    <Tooltip title={u.institute || ""} arrow>
                      <span>{shortInstituteName(u.institute)}</span>
                    </Tooltip>
                  </TableCell>
                )}
                {/* Address cell with ellipsis and tooltip */}
                {!isMobile && (
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 120,
                      cursor: "pointer",
                    }}
                  >
                    <Tooltip title={u.address || ""} arrow>
                      <span>
                        {u.address && u.address.length > 24
                          ? u.address.slice(0, 24) + "..."
                          : u.address}
                      </span>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell>{u.idNumber}</TableCell>
                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      onClick={() => onViewUser(u._id)}
                      startIcon={<PersonIcon />}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        minWidth: 70,
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.100"
                            : "primary.main",
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "grey.700"
                            : "primary.main",
                        "&:hover": {
                          borderColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      View
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => onDeleteUser(u._id)}
                      size="small"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* User Details Dialog */}
      <Dialog
        open={!!adminUserDetails}
        onClose={() => {
          setAdminUserDetails(null);
          setDownloadLink("");
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor:
              theme.palette.mode === "dark" ? "grey.900" : "background.paper",
          },
        }}
      >
        <DialogContent>
          {adminUserDetails && (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6" fontWeight={700}>
                      {adminUserDetails.user.name}
                    </Typography>
                    {/* Email Icon */}
                    <Tooltip title="Send Completion Email">
                      <span>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={handleSendEmail}
                          disabled={sending}
                          sx={{ ml: 1 }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {adminUserDetails.user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {adminUserDetails.user.phone}
                  </Typography>
                </Box>
              </Stack>
              {/* Download Link Input */}
              <TextField
                label="Download Link"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="https://your-link.com/file.zip"
              />
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  maxWidth: 350,
                }}
              >
                <b>Institute:</b> {adminUserDetails.user.institute}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: 200,
                }}
              >
                <b>Address:</b> {adminUserDetails.user.address}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <b>ID Number:</b> {adminUserDetails.user.idNumber}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Orders:
              </Typography>
              <Box
                component="ul"
                sx={{
                  margin: 0,
                  pl: 2,
                  maxHeight: 180,
                  overflowY: "auto",
                  fontSize: 15,
                }}
              >
                {adminUserDetails.orders.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No orders found.
                  </Typography>
                )}
                {adminUserDetails.orders.map((o) => (
                  <li key={o._id}>
                    <b>{o.projects.map((p) => p.title).join(", ")}</b>
                    {" - "}
                    <span style={{ color: "#1976d2" }}>${o.total}</span>
                    {" - "}
                    <span
                      style={{
                        color: o.status === "Completed" ? "#43a047" : "#e53935",
                        fontWeight: 600,
                      }}
                    >
                      {o.status}
                    </span>
                  </li>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, fontWeight: 700 }}
                onClick={() => {
                  setAdminUserDetails(null);
                  setDownloadLink("");
                }}
                fullWidth
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for email status */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
