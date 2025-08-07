import React from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Avatar, Stack, Divider
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function AdminUsersView({ adminUsers, onViewUser, adminUserDetails, setAdminUserDetails }) {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} align="center" sx={{ mb: 4, color: "primary.main" }}>
        All Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Institute</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>ID Number</TableCell>
            <TableCell>View Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminUsers.map(u => (
            <TableRow key={u._id}>
              <TableCell>
                <Chip avatar={<Avatar><PersonIcon /></Avatar>} label={u.name} />
              </TableCell>
              <TableCell>{u._id}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone}</TableCell>
              <TableCell>{u.institute}</TableCell>
              <TableCell>{u.address}</TableCell>
              <TableCell>{u.idNumber}</TableCell>
              <TableCell>
                <Button onClick={() => onViewUser(u._id)} startIcon={<PersonIcon />}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {adminUserDetails && (
        <Box
          sx={{
            mt: 4,
            maxWidth: 500,
            mx: "auto",
            borderRadius: 3,
            boxShadow: 3,
            p: 3,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
              <PersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {adminUserDetails.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {adminUserDetails.user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {adminUserDetails.user.phone}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            <b>Institute:</b> {adminUserDetails.user.institute}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <b>Address:</b> {adminUserDetails.user.address}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <b>ID Number:</b> {adminUserDetails.user.idNumber}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Orders:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {adminUserDetails.orders.map(o => (
              <li key={o._id}>
                <b>{o.projects.map(p => p.title).join(', ')}</b>
                {" - "}
                <span style={{ color: "#1976d2" }}>${o.total}</span>
                {" - "}
                <span style={{ color: o.status === "Completed" ? "#43a047" : "#e53935" }}>{o.status}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, fontWeight: 700 }}
            onClick={() => setAdminUserDetails(null)}
            fullWidth
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
}