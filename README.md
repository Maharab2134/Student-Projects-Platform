# Student Projects Platform

## Overview
Student Projects Platform is a full-stack web application that connects students, developers, and buyers for academic and custom software projects. The platform allows users to buy, sell, and request custom projects, manage orders, and view success stories. It features a React frontend and a Node.js/Express backend with MongoDB.

## Features
- User authentication (JWT-based)
- Admin dashboard for managing users, products, orders, and custom requests
- Project marketplace with categories (Web, App, ML, etc.)
- Custom project request and management
- Shopping cart and order management
- Payment integration (Bkash)
- User profile and order history
- Success stories and testimonials
- Legal, privacy, refund, and terms pages

## Tech Stack
- **Frontend:** React, Material-UI, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Other:** Nodemailer, dotenv, cors

## Folder Structure
```
student-projects-platform/
├── client/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Admin/         # Admin dashboard views
│       │   ├── Auth/          # Authentication dialogs
│       │   ├── Pages/         # Main user pages (cart, orders, profile, etc.)
│       │   ├── ULink/         # About, legal, privacy, refund, terms
│       │   └── Utility/       # Navbar, footer, grid, etc.
│       ├── App.js
│       └── index.js
├── server/           # Node.js backend
│   ├── index.js      # Main server file
│   └── package.json
├── package.json      # Project scripts and dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation
1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd student-projects-platform
	```
2. **Install root dependencies:**
	```bash
	npm install
	```
3. **Install client dependencies:**
	```bash
	cd client
	npm install
	cd ..
	```
4. **Install server dependencies:**
	```bash
	cd server
	npm install
	cd ..
	```

### Environment Variables
Create a `.env` file in the `server/` directory with the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the App
From the project root, run:
```bash
npm start
```
This will concurrently start both the backend (on port 5000) and the frontend (on port 3000).

## Usage
- Visit `http://localhost:3000` to access the platform.
- Browse, buy, or request projects. Admins can manage all data from the dashboard.

## License
This project is licensed under the ISC License.
