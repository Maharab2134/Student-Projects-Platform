import React, { useState, useEffect } from "react";
import { Container, Box, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import {
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Navbar from "./components/Utility/Navbar";
import Footer from "./components/Utility/Footer";
import AuthDialog from "./components/Auth/AuthDialog";
import ProjectGrid from "./components/Utility/ProjectGrid";
import AdminProductsView from "./components/Admin/AdminProductsView";
import AdminOrdersView from "./components/Admin/AdminOrdersView";
import AdminUsersView from "./components/Admin/AdminUsersView";
import AdminTeamPage from "./components/Admin/AdminTeamPage";
import ProfilePage from "./components/Pages/ProfilePage";
import CartPage from "./components/Pages/CartPage";
import OrdersPage from "./components/Pages/OrdersPage";
import BkashPage from "./components/Pages/BkashPage";
import SuccessStories from "./components/Pages/SuccessStories";
import CustomProjectModal from "./components/Pages/CustomProjectModal";
import AdminCustomRequests from "./components/Admin/CustomRequestsView";
import ViewCustomRequest from "./components/Pages/ViewCustomRequest";
import ScrollToTop from "./components/Utility/ScrollToTop";

// Additional imports for ULink pages
import AboutUsPage from "./components/ULink/AboutUsPage";
import RefundPolicyPage from "./components/ULink/RefundPolicyPage";
import TermsPage from "./components/ULink/TermsPage";
import PrivacyPolicyPage from "./components/ULink/PrivacyPolicyPage";

const API = "https://student-projects-platform.onrender.com/api";
const CATEGORIES = ["Web", "App", "ML"];

function App() {
  // Theme
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#00bcd4" },
      background: { default: darkMode ? "#181c24" : "#f4f8fb" },
      success: { main: "#43a047" },
      error: { main: "#e53935" },
    },
    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      h4: { fontWeight: 800, letterSpacing: 1 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
  });

  // State
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { ...decoded, token };
    } catch {
      return null;
    }
  });
  const [authTab, setAuthTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    success: true,
    msg: "",
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    institute: "",
    address: "",
    idNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [projects, setProjects] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [projectRatings, setProjectRatings] = useState([]);

  const [myOrders, setMyOrders] = useState([]);
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUserDetails, setAdminUserDetails] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    desc: "",
    price: "",
    img: "",
    category: "",
    language: [],
  });
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    institute: user?.institute || "",
    address: user?.address || "",
    idNumber: user?.idNumber || "",
  });

  // Effects
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        institute: user.institute,
        address: user.address,
        idNumber: user.idNumber,
      });
    }
  }, [user]);
  useEffect(() => {
    axios.get(`${API}/projects`).then((res) => setProjects(res.data));
  }, []);
  useEffect(() => {
    if (user && user.isAdmin) {
      axios
        .get(`${API}/admin/orders`, { headers: { Authorization: user.token } })
        .then((res) => setAdminOrders(res.data));
      axios
        .get(`${API}/admin/users`, { headers: { Authorization: user.token } })
        .then((res) => setAdminUsers(res.data));
    }
    if (user && !user.isAdmin) {
      axios
        .get(`${API}/myorders`, { headers: { Authorization: user.token } })
        .then((res) => setMyOrders(res.data));
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/project-ratings")
      .then((res) => setProjectRatings(res.data));
  }, [projects]);

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, loginForm);
      const decoded = jwtDecode(res.data.token);
      setUser({ ...decoded, token: res.data.token });
      localStorage.setItem("token", res.data.token);
      setLoginOpen(false);
      setSnackbar({ open: true, success: true, msg: "Logged in!" });
    } catch {
      setSnackbar({ open: true, success: false, msg: "Invalid credentials" });
    }
  };

  const onNextStage = async (orderId, nextStatus) => {
    try {
      await axios.put(
        `${API}/admin/order/${orderId}/status`,
        { status: nextStatus },
        { headers: { Authorization: user.token } }
      );
      // Refetch orders after update
      const res = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: user.token },
      });
      setAdminOrders(res.data);
      setSnackbar({ open: true, success: true, msg: "Order status updated!" });
    } catch {
      setSnackbar({
        open: true,
        success: false,
        msg: "Failed to update order status",
      });
    }
  };

  const onDeleteOrder = async (orderId) => {
    await axios.delete(`${API}/admin/order/${orderId}`, {
      headers: { Authorization: user.token },
    });
    const res = await axios.get(`${API}/admin/orders`, {
      headers: { Authorization: user.token },
    });
    setAdminOrders(res.data);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/register`, registerForm);
      setSnackbar({
        open: true,
        success: true,
        msg: "Registered! Please login.",
      });
      setAuthTab(0); // Switch to Login tab
    } catch {
      setSnackbar({ open: true, success: false, msg: "Registration failed" });
    }
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setCart([]);
    localStorage.removeItem("cart");
    setMyOrders([]);
    setAdminOrders([]);
    setAdminUsers([]);
    setSnackbar({ open: true, success: true, msg: "Logged out" });
    setPage("home");
  };
  const addToCart = (project) => {
    if (cart.find((p) => p._id === project._id)) return;
    setCart([...cart, project]);
    setSnackbar({ open: true, success: true, msg: "Added to cart!" });
  };
  const removeFromCart = (id) => setCart(cart.filter((p) => p._id !== id));
  const handleBuy = async (transactionId) => {
    if (!user) {
      setSnackbar({ open: true, success: false, msg: "Login to buy" });
      return;
    }
    if (cart.length === 0) {
      setSnackbar({ open: true, success: false, msg: "Cart is empty" });
      return;
    }
    if (!transactionId) {
      setSnackbar({
        open: true,
        success: false,
        msg: "Enter bKash Transaction ID",
      });
      return;
    }
    try {
      await axios.post(
        `${API}/order`,
        {
          projects: cart,
          total: cart.reduce((sum, p) => sum + p.price, 0),
          paymentMethod: "bKash",
          transactionId,
        },
        { headers: { Authorization: user.token } }
      );
      setSnackbar({
        open: true,
        success: true,
        msg: "Order placed!",
      });
      setCart([]);
      setPage("orders");
      const res = await axios.get(`${API}/myorders`, {
        headers: { Authorization: user.token },
      });
      setMyOrders(res.data);
    } catch {
      setSnackbar({ open: true, success: false, msg: "Order failed" });
    }
  };
  const handleAddProject = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/admin/project`, newProject, {
      headers: { Authorization: user.token },
    });
    setSnackbar({ open: true, success: true, msg: "Project added!" });
    setNewProject({
      title: "",
      desc: "",
      price: "",
      img: "",
      category: "",
      language: [],
      duration: "",
      sold: 0,
    });
    const res = await axios.get(`${API}/projects`);
    setProjects(res.data);
  };
  const handleUpdateProject = async (id, updated) => {
    await axios.put(`${API}/admin/project/${id}`, updated, {
      headers: { Authorization: user.token },
    });
    setSnackbar({ open: true, success: true, msg: "Project updated!" });
    const res = await axios.get(`${API}/projects`);
    setProjects(res.data);
  };
  const handleDeleteProject = async (id) => {
    await axios.delete(`${API}/admin/project/${id}`, {
      headers: { Authorization: user.token },
    });
    setSnackbar({ open: true, success: true, msg: "Project deleted!" });
    const res = await axios.get(`${API}/projects`);
    setProjects(res.data);
  };
  const handleViewUser = async (id) => {
    const res = await axios.get(`${API}/admin/user/${id}`, {
      headers: { Authorization: user.token },
    });
    setAdminUserDetails(res.data);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar
        user={user}
        setPage={setPage}
        setLoginOpen={setLoginOpen}
        cart={cart}
        handleLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <AuthDialog
          open={loginOpen || registerOpen}
          onClose={() => {
            setLoginOpen(false);
            setRegisterOpen(false);
          }}
          onLogin={handleLogin}
          onRegister={handleRegister}
          setLoginForm={setLoginForm}
          setRegisterForm={setRegisterForm}
          registerForm={registerForm}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showRegPassword={showRegPassword}
          setShowRegPassword={setShowRegPassword}
          snackbar={snackbar}
          setSnackbar={setSnackbar}
          authTab={authTab}
          setAuthTab={setAuthTab}
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {page === "home" && (
            <>
              <section
                style={{
                  padding: "40px 0 0 0",
                  borderRadius: "24px",
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.08)",
                  marginBottom: "32px",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={900}
                  align="center"
                  sx={{
                    mb: 3,
                    color: "primary.main",
                    letterSpacing: 1,
                    fontFamily: "Poppins, Inter, Arial, sans-serif",
                  }}
                >
                  Explore Projects
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth < 900 ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 32,
                    gap: 16,
                    maxWidth: 700,
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: 16,
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(25, 118, 210, 0.08)",
                  }}
                >
                  <TextField
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: 2,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="#1976d2"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                            />
                          </svg>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <ProjectGrid
                  projects={projects}
                  addToCart={addToCart}
                  user={user}
                  openLogin={() => setLoginOpen(true)}
                  selectedCategory={selectedCategory}
                  search={search}
                  projectRatings={projectRatings}
                />
              </section>
              {user && !user.isAdmin && <CustomProjectModal user={user} />}
              <section
                style={{
                  padding: "32px 0",
                  borderRadius: "24px",
                  boxShadow: "0 2px 12px rgba(25, 118, 210, 0.08)",
                  margin: "32px 0",
                }}
              >
                {(!user || !user.isAdmin) && <SuccessStories />}
              </section>
            </>
          )}
          {user && !user.isAdmin && page === "cart" && (
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              setPage={setPage}
            />
          )}

          {user && !user.isAdmin && page === "bkash" && (
            <BkashPage
              total={cart.reduce((sum, p) => sum + p.price, 0)}
              onBack={() => setPage("cart")}
              handleBuy={handleBuy}
            />
          )}

          {user && !user.isAdmin && page === "orders" && (
            <OrdersPage myOrders={myOrders} user={user} />
          )}

          {user && !user.isAdmin && page === "profile" && (
            <ProfilePage
              user={user}
              editProfile={editProfile}
              setEditProfile={setEditProfile}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              setSnackbar={setSnackbar}
              setUser={setUser}
            />
          )}

          {user && user.isAdmin && page === "admin_products" && (
            <AdminProductsView
              projects={projects}
              onAdd={handleAddProject}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              newProject={newProject}
              setNewProject={setNewProject}
            />
          )}
          {user && user.isAdmin && page === "admin_orders" && (
            <AdminOrdersView
              adminOrders={adminOrders}
              onNextStage={onNextStage}
              onDeleteOrder={onDeleteOrder}
            />
          )}
          {user && user.isAdmin && page === "admin_users" && (
            <AdminUsersView
              adminUsers={adminUsers}
              onViewUser={handleViewUser}
              adminUserDetails={adminUserDetails}
              setAdminUserDetails={setAdminUserDetails}
            />
          )}
          {user && user.isAdmin && page === "admin_custom_requests" && (
            <AdminCustomRequests user={user} />
          )}
          {user && !user.isAdmin && page === "my_custom_requests" && (
            <ViewCustomRequest user={user} />
          )}
          {user && user.isAdmin && page === "admin_team" && (
            <AdminTeamPage user={user} />
          )}
          {/* ULink Pages */}

          {page === "about" && <AboutUsPage user={user} />}
          {page === "refund" && <RefundPolicyPage user={user} />}
          {page === "terms" && <TermsPage user={user} />}
          {page === "privacy" && <PrivacyPolicyPage user={user} />}
        </Container>
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
      <ScrollToTop />
      <Footer setPage={setPage} user={user} />
    </ThemeProvider>
  );
}

export default App;
