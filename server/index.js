const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =====================
// MongoDB connection
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// =====================
// MODELS
// =====================

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
    rating: { type: Number, default: 0 },
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

// =====================
// MIDDLEWARE
// =====================

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

function admin(req, res, next) {
  if (!req.user.isAdmin) return res.sendStatus(403);
  next();
}

// =====================
// STATIC ADMIN
// =====================

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

// =====================
// AUTH ROUTES
// =====================

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send("Invalid email or password");

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
    await User.create({
      name,
      email,
      phone,
      institute,
      address,
      idNumber,
      password: hashed,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).send("Email already exists");
  }
});

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

// =====================
// PROJECT & ORDERS
// =====================

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post("/api/order", auth, async (req, res) => {
  const { projects, total, paymentMethod, transactionId } = req.body;
  if (!projects || !total || !paymentMethod || !transactionId)
    return res.status(400).send("Missing fields");

  for (const p of projects) {
    let project = await Project.findById(p._id);
    if (!project) {
      project = await Project.create({
        _id: p._id,
        title: p.title,
        desc: p.desc,
        price: p.price,
        img: p.img,
        category: p.category,
        language: p.language,
        sold: "1",
        duration: p.duration,
        rating: 0,
      });
    } else {
      project.sold = (parseInt(project.sold || "0") + 1).toString();
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

app.get("/api/myorders", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// =====================
// CUSTOM REQUESTS
// =====================

app.get("/api/myrequests", auth, async (req, res) => {
  const requests = await CustomRequest.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(requests);
});

app.post("/api/request", auth, async (req, res) => {
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
  res.json({ success: true });
});

// =====================
// TEAM MEMBERS
// =====================

app.get("/api/team", async (req, res) => {
  const team = await TeamMember.find();
  res.json(team);
});

// =====================
// ADMIN ROUTES
// =====================

function validateStatus(status) {
  const allowed = [
    "Pending",
    "Accepted",
    "Working",
    "Delivery",
    "Complete",
    "Rejected",
  ];
  return allowed.includes(status);
}

app.use("/api/admin", auth, admin);

app.post("/api/admin/project", async (req, res) => {
  await Project.create(req.body);
  res.json({ success: true });
});

app.put("/api/admin/project/:id", async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete("/api/admin/project/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.put("/api/admin/order/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!validateStatus(status))
    return res.status(400).json({ error: "Invalid status" });
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.json({ success: true });
});

app.delete("/api/admin/order/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/users", async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.json(users);
});

app.get("/api/admin/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const orders = await Order.find({ userId: req.params.id });
  res.json({ user, orders });
});

app.get("/api/admin/requests", async (req, res) => {
  const requests = await CustomRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

app.put("/api/admin/request/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!validateStatus(status))
    return res.status(400).json({ error: "Invalid status" });
  await CustomRequest.findByIdAndUpdate(req.params.id, { status });
  res.json({ success: true });
});

app.delete("/api/admin/request/:id", async (req, res) => {
  await CustomRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.post("/api/team", async (req, res) => {
  const { name, role, img } = req.body;
  await TeamMember.create({ name, role, img });
  res.json({ success: true });
});

app.put("/api/team/:id", async (req, res) => {
  await TeamMember.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete("/api/team/:id", async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// =====================
// SERVE REACT FRONTEND
// =====================

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
