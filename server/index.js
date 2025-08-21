const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Models all the data models

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    institute: String,
    address: String,
    idNumber: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
  })
);

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    title: String,
    desc: String,
    price: Number,
    img: String,
    category: String,
    language: [String],
    sold: { type: String, default: "0" },
    duration: String,
    rating: { type: Number, default: 0 }, // average rating
  })
);

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    userId: String,
    projects: Array,
    total: Number,
    paymentMethod: String,
    transactionId: String,
    rating: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  })
);

const CustomRequest = mongoose.model(
  "CustomRequest",
  new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    phone: String,
    university: String,
    type: String,
    subject: String,
    deadline: String,
    description: String,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  })
);

const TeamMember = mongoose.model(
  "TeamMember",
  new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String, required: true },
  })
);

// Auth middleware for protected routes
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Admin middleware
function admin(req, res, next) {
  if (!req.user.isAdmin) return res.sendStatus(403);
  next();
}

// Static admin creation (run once)
async function createStaticAdmin() {
  const exists = await User.findOne({ email: "admin@gmail.com" });
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      isAdmin: true,
    });
    console.log("Static admin created");
  }
}
createStaticAdmin();

// Unified login (admin or student)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@gmail.com" && password === "admin123") {
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) return res.status(401).send("Invalid");
    const token = jwt.sign(
      { id: user._id, isAdmin: true, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token, isAdmin: true, name: user.name });
  }

  // Student login
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("Invalid");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send("Invalid");
  const token = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      name: user.name,
      email: user.email,
      phone: user.phone,
      institute: user.institute,
      address: user.address,
      idNumber: user.idNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ token, isAdmin: user.isAdmin, name: user.name });
});

// Student registration
app.post("/api/register", async (req, res) => {
  const { name, email, phone, institute, address, idNumber, password } =
    req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !institute ||
    !address ||
    !idNumber ||
    !password
  )
    return res.status(400).send("Missing fields");

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name,
      email,
      phone,
      institute,
      address,
      idNumber,
      password: hashed,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).send("Email already exists");
  }
});

// Update user profile (for students)
app.put("/api/profile", auth, async (req, res) => {
  const { name, email, phone, institute, address, idNumber } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, institute, address, idNumber },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (e) {
    res.status(400).send("Profile update failed");
  }
});

// User give rating in project.
app.post("/api/order/:id/rate", auth, async (req, res) => {
  const { rating } = req.body;
  if (!rating) return res.status(400).json({ error: "Rating required" });
  await Order.findByIdAndUpdate(req.params.id, { rating });

  // Update average rating for each project in this order
  const order = await Order.findById(req.params.id);
  if (order) {
    for (const p of order.projects) {
      const project = await Project.findById(p._id);
      if (project) {
        // Find all ratings for this project from orders
        const ordersWithThisProject = await Order.find({
          "projects._id": project._id,
          rating: { $gt: 0 },
        });
        const ratings = ordersWithThisProject.map((o) => o.rating);
        const avg =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        project.rating = avg;
        await project.save();
      }
    }
  }

  res.json({ success: true });
});

// Get average rating for all projects
app.get("/api/project-ratings", async (req, res) => {
  const projects = await Project.find();
  const orders = await Order.find({ rating: { $gt: 0 } });

  const projectRatings = projects.map((project) => {
    const relatedOrders = orders.filter((order) =>
      order.projects.some((p) => p._id == project._id.toString())
    );
    const ratings = relatedOrders.map((order) => order.rating);
    const avg =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;
    return {
      projectId: project._id.toString(),
      averageRating: avg,
      ratingCount: ratings.length,
    };
  });

  res.json(projectRatings);
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Get all team members
app.get("/api/team", async (req, res) => {
  const team = await TeamMember.find();
  res.json(team);
});

// Admin: add project
app.post("/api/admin/project", auth, admin, async (req, res) => {
  const { title, desc, price, img, category, language, duration, sold } =
    req.body;
  await Project.create({
    title,
    desc,
    price,
    img,
    category,
    language,
    sold,
    duration,
  });
  res.json({ success: true });
});

// Admin: Add team member
app.post("/api/team", auth, admin, async (req, res) => {
  const { name, role, img } = req.body;
  if (!name || !role || !img) return res.status(400).send("Missing fields");
  await TeamMember.create({ name, role, img });
  res.json({ success: true });
});

// Admin: Update team member
app.put("/api/team/:id", auth, admin, async (req, res) => {
  const { name, role, img } = req.body;
  if (!name || !role || !img) return res.status(400).send("Missing fields");
  await TeamMember.findByIdAndUpdate(req.params.id, { name, role, img });
  res.json({ success: true });
});

// Admin: update project
app.put("/api/admin/project/:id", auth, admin, async (req, res) => {
  const { title, desc, price, img, category, language, sold, duration } =
    req.body;
  await Project.findByIdAndUpdate(req.params.id, {
    title,
    desc,
    price,
    img,
    category,
    language,
    sold,
    duration,
  });
  res.json({ success: true });
});

// Admin: Delete a team member
app.delete("/api/team/:id", auth, admin, async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Admin: delete project
app.delete("/api/admin/project/:id", auth, admin, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Students: Place order (buy projects)
app.post("/api/order", auth, async (req, res) => {
  const { projects, total, paymentMethod, transactionId } = req.body;
  if (!projects || !total || !paymentMethod || !transactionId)
    return res.status(400).send("Missing fields");

  for (const p of projects) {
    let project = await Project.findOne({ _id: p._id });
    if (!project) {
      project = await Project.create({
        _id: p._id,
        title: p.title,
        desc: p.desc,
        price: p.price,
        img: p.img,
        category: p.category,
        language: p.language,
        sold: "1", // as string
        duration: p.duration,
        rating: 0,
      });
    } else {
      const currentSold = parseInt(project.sold || "0", 10);
      project.sold = (currentSold + 1).toString();
      await project.save();
    }
  }

  await Order.create({
    userId: req.user.id,
    projects,
    total,
    paymentMethod,
    transactionId,
  });
  res.json({ success: true });
});

// Student: view my orders
app.get("/api/myorders", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// Student: view my custom project requests
app.get("/api/myrequests", auth, async (req, res) => {
  const requests = await CustomRequest.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(requests);
});

// Student: submit custom project request
app.post("/api/request", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      university,
      type,
      subject,
      deadline,
      description,
    } = req.body;
    await CustomRequest.create({
      userId: req.user.id,
      name,
      email,
      phone,
      university,
      type,
      subject,
      deadline,
      description,
    });
    res.json({ success: true, message: "Request submitted successfully!" });
  } catch (e) {
    res.status(500).json({ error: "Failed to submit request." });
  }
});

// Admin: view all custom requests
app.get("/api/admin/requests", auth, admin, async (req, res) => {
  const requests = await CustomRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

// Admin: update Order request status
const allowedStatuses = [
  "Pending",
  "Accepted",
  "Working",
  "Delivery",
  "Complete",
  "Rejected",
];
app.put("/api/admin/order/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.json({ success: true });
});

// Admin: update custom request status
app.put("/api/admin/request/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;
  await CustomRequest.findByIdAndUpdate(req.params.id, { status });
  res.json({ success: true });
});
// Admin: delete custom request
app.delete("/api/admin/request/:id", auth, admin, async (req, res) => {
  console.log("Delete request called for", req.params.id);
  await CustomRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Admin: view all orders
app.get("/api/admin/orders", auth, admin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: view all users
app.get("/api/admin/users", auth, admin, async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.json(users);
});

// Admin: view user details
app.get("/api/admin/user/:id", auth, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  const orders = await Order.find({ userId: req.params.id });
  res.json({ user, orders });
});

// Admin: delete Order
app.delete("/api/admin/order/:id", auth, admin, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Admin: mark order as paid (optional, for payment handle)
app.put("/api/admin/order/:id/pay", auth, admin, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "Completed" });
  res.json({ success: true });
});

// ... all your API routes above ...

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(5000, () => console.log("Server running on port 5000"));
