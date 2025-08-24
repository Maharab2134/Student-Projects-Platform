const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User schema with unique constraints
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, required: true },
  institute: { type: String, required: true },
  address: { type: String, required: true },
  idNumber: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

const reviewSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  rating: Number,
  review: String,
  date: { type: Date, default: Date.now },
});
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
    reviews: [reviewSchema], // array of reviews
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
    review: { type: String, default: "" }, // <-- review field
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

// TeamMember schema with order field
const TeamMember = mongoose.model(
  "TeamMember",
  new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String, required: true },
    order: { type: Number, default: 0 }, // <-- for ordering
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
  const user = await User.findOne({ email: email.toLowerCase() });
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
  ) {
    return res.status(400).send("Missing fields");
  }

  try {
    // Check for existing user with same email or idNumber
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { idNumber: idNumber }],
    });

    if (existingUser) {
      return res.status(400).send("Email or ID Number already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      institute,
      address,
      idNumber,
      password: hashed,
    });

    res.json({ success: true });
  } catch (e) {
    if (e.code === 11000) {
      // Duplicate key error
      const field = Object.keys(e.keyValue)[0];
      return res.status(400).send(`${field} already exists`);
    }
    console.error("Registration error:", e);
    res.status(500).send("Server error");
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

// User give rating in project (optional, can be removed if not used)
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

// User give review in order (and save in project)
app.post("/api/order/:id/review", auth, async (req, res) => {
  const { review, rating } = req.body;
  if (!review || review.length < 2)
    return res.status(400).json({ error: "Review too short" });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.userId !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });
  if (order.review && order.review.length > 0)
    return res.status(400).json({ error: "Already reviewed" });

  order.review = review;
  if (rating) order.rating = rating;
  await order.save();

  for (const p of order.projects) {
    await Project.findByIdAndUpdate(
      p._id,
      {
        $push: {
          reviews: {
            userId: req.user.id,
            userName: req.user.name,
            rating: rating || order.rating || 0,
            review,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    const project = await Project.findById(p._id);
    if (project && project.reviews && project.reviews.length > 0) {
      const ratings = project.reviews
        .map((r) => r.rating)
        .filter((r) => typeof r === "number" && !isNaN(r));
      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      project.rating = avg;
      await project.save();
    }
  }

  res.json({ success: true, review });
});

// Get average rating for all projects (from reviews array)
app.get("/api/project-ratings", async (req, res) => {
  const projects = await Project.find();

  const projectRatings = projects.map((project) => {
    const ratings = (project.reviews || [])
      .map((review) => review.rating)
      .filter((r) => typeof r === "number" && !isNaN(r));

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
app.get("/api/project/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

// Get all team members, sorted by order
app.get("/api/team", async (req, res) => {
  const team = await TeamMember.find().sort({ order: 1 });
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

// Admin: Add team member (set order to end)
app.post("/api/team", auth, admin, async (req, res) => {
  const { name, role, img } = req.body;
  if (!name || !role || !img) return res.status(400).send("Missing fields");
  const count = await TeamMember.countDocuments();
  await TeamMember.create({ name, role, img, order: count });
  res.json({ success: true });
});

// Admin: Update team member
app.put("/api/team/:id", auth, admin, async (req, res) => {
  const { name, role, img } = req.body;
  if (!name || !role || !img) return res.status(400).send("Missing fields");
  await TeamMember.findByIdAndUpdate(req.params.id, { name, role, img });
  res.json({ success: true });
});

// Admin: Reorder team members
app.post("/api/team/reorder", auth, admin, async (req, res) => {
  const { order } = req.body; // order: [id1, id2, ...]
  if (!Array.isArray(order)) return res.status(400).send("Invalid order array");
  for (let i = 0; i < order.length; i++) {
    await TeamMember.findByIdAndUpdate(order[i], { order: i });
  }
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

// Admin: delete user
app.delete("/api/admin/users/:id", auth, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete user" });
  }
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

app.get("/api", (req, res) => {
  res.send("API is working!");
});

const nodemailer = require("nodemailer");

// API: Send project completion email to user (with download link)
app.post("/api/admin/send-complete-mail", auth, admin, async (req, res) => {
  try {
    const { to, name, order, downloadLink } = req.body;
    if (!to || !name || !order) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Project info
    const project =
      order.projects && order.projects[0] ? order.projects[0] : {};
    const subject = `Your Project "${
      project.title || "Project"
    }" is Completed!`;

    const body = `
👋 Hello ${name},

Thank you for placing an order with us!
We’re excited to inform you that your project "${
      project.title || "Project"
    }" has been successfully completed. 🎉

Project Details:
- Type: ${project.category || "N/A"}
- Order ID: ${order._id}
- Delivery Date: ${new Date(order.createdAt).toLocaleDateString()}

You can download your project files using the secure link below:
${downloadLink || "[Download Link]"}

If you have any questions, need modifications, or further assistance, feel free to reply to this email.
We appreciate your trust in our service and look forward to working with you again.

Best regards,
🚀 Student Project Shop Team
studentcrafted@gmail.com
`;

    // Optional: HTML version for email clients that support rich formatting
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Project Delivery - Student Project Shop</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <p>👋 Hello <b>${name}</b>,</p>
  <p>
    Thank you for placing an order with us!<br>
    We’re excited to inform you that your project <b>"${
      project.title || "Project"
    }"</b> has been successfully completed. 🎉
  </p>
  <h3 style="color:#1976d2;">📄 Project Details</h3>
  <ul style="padding-left:18px;">
    <li><b>Type:</b> ${project.category || "N/A"}</li>
    <li><b>Order ID:</b> ${order._id}</li>
    <li><b>Delivery Date:</b> ${new Date(
      order.createdAt
    ).toLocaleDateString()}</li>
  </ul>
  <p>
    <b>⬇ You can download your project files using the secure link below:</b><br>
    <a href="${downloadLink || "#"}" 
       style="display:inline-block; margin-top:8px; padding:10px 16px; background-color:#1976d2; color:#ffffff; text-decoration:none; border-radius:4px;">
       🔗 Download Project Files
    </a>
  </p>
  <p>
    If you have any questions, need modifications, or further assistance, feel free to reply to this email.<br>
    We appreciate your trust in our service and look forward to working with you again.
  </p>
  <p>
    Best regards,<br>
    🚀 <b>Student Project Shop Team</b><br>
    studentcrafted@gmail.com
  </p>
  <hr style="margin-top:30px; border:none; border-top:1px solid #ddd;">
  <p style="font-size:13px; color:#888;">&copy; ${new Date().getFullYear()} Student Project Shop. All rights reserved.</p>
</body>
</html>
`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "studentcrafted@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: "studentcrafted@gmail.com",
      to,
      subject,
      text: body,
      html: htmlBody, 
    });

    res.json({ success: true });
  } catch (e) {
    console.error("Mail send error:", e);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
