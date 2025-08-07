import { Typography, Avatar, Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Updated dummy team data
const team = [
  {
    name: "Md. Rahim Uddin",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Fatema Khatun",
    role: "Lead Developer",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Sabbir Hossain",
    role: "ML Engineer",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Nusrat Jahan",
    role: "Community Manager",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Rafiul Islam",
    role: "UI/UX Designer",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    name: "Sumaiya Akter",
    role: "Full Stack Developer",
    img: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];

// Dummy testimonials
const testimonials = [
  {
    name: "Aminul Islam",
    text: "Student Project Shop helped me find real, quality projects for my thesis. Highly recommended!",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Shila Akter",
    text: "I sold my app project here and got great feedback from buyers. The process was smooth and secure.",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Tanvir Hasan",
    text: "The support team is very responsive and the platform is easy to use.",
    img: "https://randomuser.me/api/portraits/men/23.jpg",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function AboutUsPage() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box sx={{ maxWidth: "1100px", mx: "auto", px: 2, py: 4 }}>
      {/* About Us Heading */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          color="primary"
          gutterBottom
          sx={{ textAlign: "center", fontFamily: "Poppins, Inter" }}
        >
          About Us
        </Typography>
      </motion.div>

      {/* Team Grid */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="secondary"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Meet Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {team.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                whileHover={{ scale: 1.05 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Avatar
                    src={member.img}
                    alt={member.name}
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 1,
                      boxShadow: "0 4px 16px 0 rgba(25,118,210,0.10)",
                    }}
                  />
                  <Typography fontWeight={700} sx={{ textAlign: "center" }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                    {member.role}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission & Vision */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mt: 8,
          alignItems: "center",
        }}
      >
        <Box flex={1}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={show ? "visible" : "hidden"}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="secondary"
              gutterBottom
            >
              Our Mission & Vision
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7 }}>
              Our mission is to empower creators, learners, and innovators by making project sharing easy, accessible, and inspiring for everyone—no matter your background or goal.
            </Typography>
          </motion.div>
        </Box>
        <Box flex={1}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={show ? "visible" : "hidden"}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60"
              alt="Mission"
              style={{ width: "100%", borderRadius: 12, minHeight: 220, objectFit: "cover" }}
            />
          </motion.div>
        </Box>
      </Box>

      {/* Why People Trust Us */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: 4,
          mt: 8,
          alignItems: "center",
        }}
      >
        <Box flex={1}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={show ? "visible" : "hidden"}
          >
            <img
              src="https://images.unsplash.com/photo-1579758300918-333e43ba760d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJ1c3R8ZW58MHx8MHx8fDA%3D"
              alt="Trust"
              style={{ width: "100%", borderRadius: 12, minHeight: 220, objectFit: "cover" }}
            />
          </motion.div>
        </Box>
        <Box flex={1}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={show ? "visible" : "hidden"}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="secondary"
              gutterBottom
            >
              Why People Trust Us
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7 }}>
              We prioritize transparency, quality, and innovation. Our community of users knows they can depend on us for reliable, cutting-edge solutions. Every project is reviewed, and our support team is always ready to help.
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* Testimonials */}
      <Box sx={{ mt: 8 }}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={show ? "visible" : "hidden"}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color="secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            What Our Users Say
          </Typography>
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((t) => (
            <Grid item xs={12} sm={6} md={4} key={t.name}>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                whileHover={{ scale: 1.04 }}
              >
                <Box sx={{ textAlign: "center", maxWidth: 320, mx: "auto", p: 2 }}>
                  <Avatar
                    src={t.img}
                    alt={t.name}
                    sx={{ width: 56, height: 56, mx: "auto", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    "{t.text}"
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}