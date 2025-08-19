import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Stack,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";

export default function Navbar({
  user,
  setPage,
  setLoginOpen,
  cart,
  handleLogout,
  darkMode,
  setDarkMode,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ordersAnchorEl, setOrdersAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const openOrdersMenu = Boolean(ordersAnchorEl);
  const openMobileMenu = Boolean(mobileMenuAnchor);

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handlePageChange = (page) => {
    setPage(page);
    handleMobileMenuClose();
  };

  // Regular user menu items
  const userMenuItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      action: () => handlePageChange("home"),
    },
    {
      label: "My Orders",
      icon: <ListAltIcon />,
      subItems: [
        { label: "All Orders", action: () => handlePageChange("orders") },
        {
          label: "Custom Orders",
          action: () => handlePageChange("my_custom_requests"),
        },
      ],
    },
    {
      label: "Cart",
      icon: <AddShoppingCartIcon />,
      badge: cart.length,
      action: () => handlePageChange("cart"),
    },
    {
      label: "Profile",
      icon: <PersonIcon />,
      action: () => handlePageChange("profile"),
    },
    { label: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  // Admin menu items
  const adminMenuItems = [
    { label: "Products", action: () => handlePageChange("admin_products") },
    { label: "Orders", action: () => handlePageChange("admin_orders") },
    { label: "Users", action: () => handlePageChange("admin_users") },
    {
      label: "Custom Requests",
      action: () => handlePageChange("admin_custom_requests"),
    },
    { label: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
          onClick={() => setPage("home")}
        >
          {user && user.isAdmin ? "Admin Panel" : "Student Project Shop"}
        </Typography>

        {/* Dark mode toggle */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ mr: isMobile ? 1 : 2 }}
        >
          <DarkModeIcon
            sx={{ color: darkMode ? "#fff" : "#90caf9", fontSize: 20 }}
          />
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode((d) => !d)}
            color="default"
            size="small"
            sx={{ mx: 0.5 }}
          />
          <LightModeIcon
            sx={{ color: !darkMode ? "#fff" : "#ffd600", fontSize: 20 }}
          />
        </Stack>

        {isMobile ? (
          /* Mobile menu */
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuClick}
              sx={{ p: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={openMobileMenu}
              onClose={handleMobileMenuClose}
              PaperProps={{
                sx: { width: 280 },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Menu
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {!user ? (
                  <List>
                    <ListItem
                      button
                      onClick={() => {
                        setLoginOpen(true);
                        handleMobileMenuClose();
                      }}
                    >
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary="Login" />
                    </ListItem>
                  </List>
                ) : user.isAdmin ? (
                  <List>
                    {adminMenuItems.map((item, index) => (
                      <ListItem key={index} button onClick={item.action}>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List>
                    {userMenuItems.map((item, index) => (
                      <div key={index}>
                        {item.subItems ? (
                          <>
                            <ListItem
                              button
                              onClick={() =>
                                setOrdersAnchorEl(
                                  document.getElementById(
                                    `orders-menu-${index}`
                                  )
                                )
                              }
                            >
                              <ListItemIcon>{item.icon}</ListItemIcon>
                              <ListItemText primary={item.label} />
                              <ArrowDropDownIcon />
                            </ListItem>
                            <Menu
                              id={`orders-menu-${index}`}
                              anchorEl={ordersAnchorEl}
                              open={Boolean(ordersAnchorEl)}
                              onClose={() => setOrdersAnchorEl(null)}
                            >
                              {item.subItems.map((subItem, subIndex) => (
                                <MenuItem
                                  key={subIndex}
                                  onClick={() => {
                                    subItem.action();
                                    setOrdersAnchorEl(null);
                                  }}
                                >
                                  {subItem.label}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        ) : (
                          <ListItem disablePadding>
                            <ListItemButton onClick={item.action}>
                              <ListItemText primary={item.label} />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </div>
                    ))}
                  </List>
                )}
              </Box>
            </Drawer>
          </>
        ) : (
          /* Desktop menu */
          <>
            {!user && (
              <Button
                color="inherit"
                onClick={() => setLoginOpen(true)}
                startIcon={<LoginIcon />}
                size="small"
                sx={{ mr: 1 }}
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
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ListAltIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={(e) => setOrdersAnchorEl(e.currentTarget)}
                  size="small"
                  sx={{ mr: 1 }}
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
                  >
                    <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                    Custom Orders
                  </MenuItem>
                </Menu>
                <Button
                  color="inherit"
                  onClick={() => setPage("cart")}
                  startIcon={
                    cart.length > 0 ? (
                      <Badge badgeContent={cart.length} color="error">
                        <AddShoppingCartIcon />
                      </Badge>
                    ) : (
                      <AddShoppingCartIcon />
                    )
                  }
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Cart
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setPage("profile")}
                  startIcon={<PersonIcon />}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  size="small"
                >
                  Logout
                </Button>
              </>
            )}
            {user && user.isAdmin && (
              <>
                <Button
                  color="inherit"
                  onClick={() => setPage("admin_products")}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Products
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setPage("admin_orders")}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Orders
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setPage("admin_users")}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Users
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setPage("admin_custom_requests")}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Custom Requests
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  size="small"
                >
                  Logout
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
