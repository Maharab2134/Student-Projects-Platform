import React, { useState } from "react";
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
  ListItemButton,
  Collapse,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import DesignServicesOutlined from "@mui/icons-material/DesignServicesOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
  const [ordersAnchorEl, setOrdersAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [openOrdersMobile, setOpenOrdersMobile] = useState(false);

  const openOrdersMenu = Boolean(ordersAnchorEl);
  const openMobileMenu = Boolean(mobileMenuAnchor);

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
    setOrdersAnchorEl(null);
    setOpenOrdersMobile(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
    handleMobileMenuClose();
  };

  const handleOrdersClickMobile = () => {
    setOpenOrdersMobile(!openOrdersMobile);
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
    {
      label: "Products",
      action: () => handlePageChange("admin_products"),
      icon: <PersonIcon />,
    },
    {
      label: "Orders",
      action: () => handlePageChange("admin_orders"),
      icon: <ListAltIcon />,
    },
    {
      label: "Users",
      action: () => handlePageChange("admin_users"),
      icon: <PersonIcon />,
    },
    {
      label: "Custom Requests",
      action: () => handlePageChange("admin_custom_requests"),
      icon: <DesignServicesOutlined />,
    },
    {
      label: "Team",
      action: () => handlePageChange("admin_team"),
      icon: <PersonIcon />,
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      action: handleLogout,
    },
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
                    <ListItemButton
                      onClick={() => {
                        setLoginOpen(true);
                        handleMobileMenuClose();
                      }}
                    >
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary="Login" />
                    </ListItemButton>
                  </List>
                ) : user.isAdmin ? (
                  <List>
                    {adminMenuItems.map((item, index) => (
                      <ListItemButton key={index} onClick={item.action}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    ))}
                  </List>
                ) : (
                  <List>
                    {userMenuItems.map((item, index) => (
                      <div key={index}>
                        {item.subItems ? (
                          <>
                            <ListItemButton onClick={handleOrdersClickMobile}>
                              <ListItemIcon>{item.icon}</ListItemIcon>
                              <ListItemText primary={item.label} />
                              {openOrdersMobile ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>
                            <Collapse
                              in={openOrdersMobile}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {item.subItems.map((subItem, subIndex) => (
                                  <ListItemButton
                                    key={subIndex}
                                    onClick={subItem.action}
                                    sx={{ pl: 4 }}
                                  >
                                    <ListItemIcon>
                                      {subItem.label === "All Orders" ? (
                                        <ShoppingBagOutlined />
                                      ) : (
                                        <DesignServicesOutlined />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText primary={subItem.label} />
                                  </ListItemButton>
                                ))}
                              </List>
                            </Collapse>
                          </>
                        ) : (
                          <ListItemButton onClick={item.action}>
                            <ListItemIcon>
                              {item.badge > 0 ? (
                                <Badge badgeContent={item.badge} color="error">
                                  {item.icon}
                                </Badge>
                              ) : (
                                item.icon
                              )}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                          </ListItemButton>
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
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <ShoppingBagOutlined fontSize="small" />
                    Orders
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPage("my_custom_requests");
                      setOrdersAnchorEl(null);
                    }}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DesignServicesOutlined fontSize="small" />
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
                  onClick={() => setPage("admin_team")}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Team
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
