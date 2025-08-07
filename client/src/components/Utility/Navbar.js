import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Stack,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Switch from "@mui/material/Switch";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Navbar({
  user,
  setPage,
  setLoginOpen,
  cart,
  handleLogout,
  darkMode,
  setDarkMode,
}) {
  const [ordersAnchorEl, setOrdersAnchorEl] = React.useState(null);
  const openOrdersMenu = Boolean(ordersAnchorEl);
  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: "pointer",
          }}
          onClick={() => setPage("home")}
        >
          {user && user.isAdmin ? "Admin Panel" : "Student Project Shop"}
        </Typography>
        {/* Dark mode toggle */}
        <Stack direction="row" alignItems="center" sx={{ ml: 1, mr: 1 }}>
          <DarkModeIcon
            sx={{ color: darkMode ? "#fff" : "#90caf9", fontSize: 22 }}
          />
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode((d) => !d)}
            color="default"
            sx={{ mx: 0.5 }}
          />
          <LightModeIcon
            sx={{ color: !darkMode ? "#fff" : "#ffd600", fontSize: 22 }}
          />
        </Stack>
        {!user && (
          <Button
            color="inherit"
            onClick={() => setLoginOpen(true)}
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        )}
        {user && !user.isAdmin && (
          <>
            <Button
              color="inherit"
              onClick={() => setPage("home")}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<ListAltIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={(e) => setOrdersAnchorEl(e.currentTarget)}
            >
              My Orders
            </Button>
            <Menu
              anchorEl={ordersAnchorEl}
              open={openOrdersMenu}
              onClose={() => setOrdersAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setPage("orders");
                  setOrdersAnchorEl(null);
                }}
              >
                All Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setPage("my_custom_requests");
                  setOrdersAnchorEl(null);
                }}
                startIcon={<AssignmentIcon />}
              >
                Custom Orders
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              onClick={() => setPage("cart")}
              startIcon={<AddShoppingCartIcon />}
            >
              Cart
              {cart.length > 0 && (
                <Badge
                  badgeContent={cart.length}
                  color="error"
                  sx={{ ml: 2 }}
                />
              )}
            </Button>
            <Button
              color="inherit"
              onClick={() => setPage("profile")}
              startIcon={<PersonIcon />}
            >
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </>
        )}
        {user && user.isAdmin && (
          <>
            <Button color="inherit" onClick={() => setPage("admin_products")}>
              Products
            </Button>
            <Button color="inherit" onClick={() => setPage("admin_orders")}>
              Orders
            </Button>
            <Button color="inherit" onClick={() => setPage("admin_users")}>
              Users
            </Button>
            <Button
              color="inherit"
              onClick={() => setPage("admin_custom_requests")}
            >
              Custom Requests
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
