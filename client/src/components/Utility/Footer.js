import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Link,
  Divider,
  Button,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

const social = [
  {
    icon: <FacebookIcon />,
    href: "https://facebook.com/",
    color: "#1877f3",
  },
  {
    icon: <GitHubIcon />,
    href: "https://github.com/",
    color: "#333",
  },
  {
    icon: <LinkedInIcon />,
    href: "https://linkedin.com/",
    color: "#0a66c2",
  },
  {
    icon: <EmailIcon />,
    href: "mailto:your@email.com",
    color: "#e53935",
  },
  // WhatsApp handled separately below
];

const usefulLinks = [
  { label: "About Us", page: "about" },
  { label: "Refund Policy", page: "refund" },
  { label: "Terms and Conditions", page: "terms" },
  { label: "Privacy & App Privacy Policy", page: "privacy" },
];

export default function Footer({ setPage }) {
  // WhatsApp logic
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
  const [whatsAppMsg, setWhatsAppMsg] = useState("");
  const whatsappNumber = "8801586282609"; // Your WhatsApp number (no +, no spaces)

  const handleWhatsAppSend = () => {
    if (whatsAppMsg.trim()) {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsAppMsg
      )}`;
      window.open(url, "_blank");
      setShowWhatsAppInput(false);
      setWhatsAppMsg("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(90deg, rgba(25,118,210,0.95) 0%, rgba(0,188,212,0.95) 100%)",
          py: { xs: 3, md: 4 },
          mt: 6,
          color: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -2px 32px 0 rgba(25, 118, 210, 0.10)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: 2,
            py: 2,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Follow Us (Left) */}
          <Box flex={1} sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 1,
                color: "#fff",
                letterSpacing: 1,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Follow Us
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ pl: 0, pr: 3 }} // Adjust padding for better alignment
              >
                {social.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.15, rotate: i % 2 === 0 ? 8 : -8 }}
                    style={{ display: "inline-block" }}
                  >
                    <IconButton
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#fff",
                        bgcolor: "rgba(255,255,255,0.08)",
                        transition: "all 0.2s",
                        "&:hover": {
                          color: s.color,
                          bgcolor: "#fff",
                        },
                      }}
                      size="large"
                    >
                      {s.icon}
                    </IconButton>
                  </motion.div>
                ))}

                {/* WhatsApp icon with message box */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -8 }}
                  style={{ display: "inline-block" }}
                >
                  <IconButton
                    onClick={() => setShowWhatsAppInput((prev) => !prev)}
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(37,211,102,0.15)",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "#25D366",
                        bgcolor: "#fff",
                      },
                    }}
                    size="large"
                  >
                    <WhatsAppIcon />
                  </IconButton>
                </motion.div>
              </Stack>
            </Box>

            {showWhatsAppInput && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, justifyContent: "center" }}
              >
                <input
                  type="text"
                  placeholder="Type your WhatsApp message"
                  value={whatsAppMsg}
                  onChange={(e) => setWhatsAppMsg(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #25D366",
                    minWidth: 180,
                    outline: "none",
                  }}
                  autoFocus
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleWhatsAppSend}
                  sx={{ minWidth: 80, fontWeight: 700 }}
                >
                  Send
                </Button>
              </Stack>
            )}
            {/* create pay buy */}
            <Typography
              variant="body2"
              sx={{
                color: "#e3f2fd",
                fontSize: 15,
                textAlign: "center",
                fontWeight: 500,
                mt: 1,
              }}
            >
              <span style={{ fontWeight: 600, marginBottom: 90 }}>Pay Buy</span> is our trusted
              payment partner.
              <Link
                target="_blank"
                underline="hover"
                sx={{ color: "#fff", fontWeight: 600, display: "inline-block" }}
              >
                <img
                  src="https://btmaxhost.com/wp-content/uploads/2023/11/SSL-Commerz-Pay-1024x194.webp"
                  alt="Pay Buy"
                  style={{
                    maxWidth: 390,
                    verticalAlign: "middle",
                    borderRadius: 6,
                    marginTop: 8,
                  }}
                />
              </Link>
            </Typography>
          </Box>

          {/* Contact (Center) */}
          <Box flex={1}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 1,
                color: "#fff",
                letterSpacing: 1,
                textTransform: "uppercase",
                textAlign: { xs: "center", md: "center" },
                opacity: 0.9,
              }}
            >
              Contact Me
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e3f2fd",
                fontSize: 15,
                textAlign: { xs: "center", md: "center" },
                fontWeight: 500,
              }}
            >
              Email:&nbsp;
              <Link
                href="mailto:maharab@gmail.com"
                underline="hover"
                sx={{ color: "#fff", fontWeight: 600 }}
              >
                maharab@gmail.com
              </Link>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e3f2fd",
                fontSize: 15,
                textAlign: { xs: "center", md: "center" },
                fontWeight: 500,
              }}
            >
              Number:&nbsp;
              <Link
                href="tel:+8801586282609"
                underline="hover"
                sx={{ color: "#fff", fontWeight: 600 }}
              >
                +880 1586 282609
              </Link>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e3f2fd",
                fontSize: 15,
                textAlign: { xs: "center", md: "center" },
                mt: 0.5,
                opacity: 0.85,
              }}
            >
              Dhaka, Bangladesh
            </Typography>
            {/* Google Map Embed */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7300.286577288055!2d90.35030189560041!3d23.81350322996595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1754503085888!5m2!1sen!2sbd"
                width="100%"
                height="120"
                style={{
                  border: 0,
                  borderRadius: 8,
                  maxWidth: 300,
                  minWidth: 200,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </Box>
          {/* Useful Links (Right) */}
          <Box flex={1} sx={{ mt: { xs: 2, md: 0 } }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 1,
                color: "#fff",
                letterSpacing: 1,
                textTransform: "uppercase",
                textAlign: { xs: "center", md: "right" },
                opacity: 0.9,
              }}
            >
              Useful Links
            </Typography>
            <Stack
              direction="column"
              spacing={1}
              alignItems={{ xs: "center", md: "flex-end" }}
            >
              {usefulLinks.map((link) => (
                <motion.div
                  key={link.label}
                  whileHover={{ scale: 1.08, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: "fit-content" }}
                >
                  <Link
                    component="button"
                    onClick={() => setPage(link.page)}
                    underline="hover"
                    color="#e3f2fd"
                    sx={{
                      fontSize: 15,
                      fontWeight: 500,
                      transition: "color 0.2s",
                      "&:hover": { color: "#fff", textDecoration: "underline" },
                      textAlign: { xs: "center", md: "right" },
                      opacity: 0.95,
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.18)" }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            color: "#e3f2fd",
            fontWeight: 500,
            letterSpacing: 1,
            mt: 1,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          Made with{" "}
          <span style={{ color: "#e53935", fontWeight: 700 }}>❤️</span> by{" "}
          <b>Student Project Shop Team</b>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#e3f2fd",
            display: "block",
            mt: 0.5,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          &copy; {new Date().getFullYear()} Student Project Shop. All rights
          reserved.
        </Typography>
      </Box>
    </motion.div>
  );
}
