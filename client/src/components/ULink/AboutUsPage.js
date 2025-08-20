import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Container,
  Avatar,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// Helper for fallback image
const getImageUrl = (img) =>
  !img || typeof img !== "string" || img.trim() === ""
    ? "https://randomuser.me/api/portraits/lego/1.jpg"
    : img;

// --- Team Grid Section ---
function TeamGrid() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/team")
      .then((res) => {
        setTeam(res.data);
        setLoading(false);
      })
      .catch(() => {
        setTeam([]);
        setLoading(false);
      });
  }, []);

  // Skeleton loader for team members
  const SkeletonMember = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
        }}
      >
        <Skeleton variant="circular" width={100} height={100} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={80} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={60} />
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ mb: 10, mt: 4 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography
          variant="h3"
          fontWeight={700}
          color="primary"
          sx={{
            mb: 2,
            textAlign: "center",
            letterSpacing: 1,
            background: "linear-gradient(135deg, #1976d2 0%, #115293 100%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Meet Our Team
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            textAlign: "center",
            maxWidth: 600,
            mx: "auto",
            mb: 6,
            px: 2,
          }}
        >
          The passionate people behind our mission to revolutionize project
          sharing and collaboration.
        </Typography>
      </motion.div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4} justifyContent="center">
          {loading && [1, 2, 3, 4].map((item) => <SkeletonMember key={item} />)}

          {!loading && team.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No team members found.
              </Typography>
            </Grid>
          )}

          {team.map((member, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={member._id || idx}>
              <motion.div
                variants={fadeInUp}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 10px 30px -10px rgba(25,118,210,0.15)",
                }}
                style={{ height: "100%" }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(25, 118, 210, 0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                    height: 300,
                    width: 250,
                    transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
                    background:
                      "linear-gradient(135deg, #f9fafb 0%, #e3f2fd 100%)",
                  }}
                >
                  <Avatar
                    src={getImageUrl(member.img)}
                    alt={member.name}
                    style={{
                      width: 120,
                      height: 120,
                      marginBottom: 16,
                      border: "3px solid #1976d2",
                      boxShadow: "0 4px 12px rgba(25,118,210,0.1)",
                      objectFit: "contain", // key change
                      backgroundColor: "#fff", // optional, avoids empty space showing through
                    }}
                    imgProps={{
                      style: { objectFit: "contain" },
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://randomuser.me/api/portraits/lego/1.jpg";
                      },
                    }}
                  />

                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      fontWeight={700}
                      sx={{ mb: 0.5, color: "#0d47a1" }}
                    >
                      {member.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
}

// --- About Summary Section ---
function AboutSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          py: 6,
          px: { xs: 2, md: 6 },
          bgcolor: "#f9fafb",
          borderRadius: 4,
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.06)",
          mb: 6,
        }}
      >
        {/* Image */}
        <Box
          sx={{
            flex: 1,
            minWidth: 220,
            maxWidth: 320,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(25, 118, 210, 0.10)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
            alt="About us"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
        {/* Vertical line for desktop, horizontal for mobile */}
        <Divider
          orientation={{ xs: "horizontal", md: "vertical" }}
          flexItem
          sx={{
            mx: { md: 3 },
            my: { xs: 3, md: 0 },
            borderColor: "#1976d2",
            borderWidth: 2,
          }}
        />
        {/* Summary */}
        <Box sx={{ flex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h3"
              fontWeight={800}
              color="primary"
              sx={{
                mb: 2,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Who We Are
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#424242",
                fontSize: "1.2rem",
                lineHeight: 1.9,
                fontWeight: 400,
                maxWidth: "700px",
              }}
            >
              We are more than just a team — we are innovators, dreamers, and
              builders. With every project, we push boundaries to craft
              solutions that empower students, creators, and professionals to
              rise higher. Our mission is simple yet powerful: ignite curiosity,
              fuel collaboration, and transform ideas into impact. Guided by
              transparency, quality, and a passion for excellence, we are
              shaping the future — together.
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}

export default function AboutUsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <TeamGrid />
      <AboutSummary />
    </Container>
  );
}
