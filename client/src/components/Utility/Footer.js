import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Link,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Facebook,
  GitHub,
  LinkedIn,
  Email,
  WhatsApp,
  LocationOn,
  Phone,
  Close,
  Favorite,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const social = [
  {
    icon: <Facebook />,
    href: "https://facebook.com/",
    color: "#1877f2",
    name: "Facebook",
  },
  {
    icon: <GitHub />,
    href: "https://github.com/",
    color: "#333333",
    name: "GitHub",
  },
  {
    icon: <LinkedIn />,
    href: "https://linkedin.com/",
    color: "#0a66c2",
    name: "LinkedIn",
  },
  {
    icon: <Email />,
    href: "mailto:maharab@gmail.com",
    color: "#ea4335",
    name: "Email",
  },
  {
    icon: <WhatsApp />,
    href: "#whatsapp",
    color: "#25d366",
    name: "WhatsApp",
  },
];

const usefulLinks = [
  { label: "About Us", page: "about" },
  { label: "Refund Policy", page: "refund" },
  { label: "Terms and Conditions", page: "terms" },
  { label: "Privacy Policy", page: "privacy" },
];

export default function Footer({ setPage }) {
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsAppMsg, setWhatsAppMsg] = useState("");
  const whatsappNumber = "8801586282609";

  const handleWhatsAppSend = () => {
    if (whatsAppMsg.trim()) {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsAppMsg
      )}`;
      window.open(url, "_blank");
      setWhatsappOpen(false);
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
          background: "linear-gradient(135deg, #1976d2 0%, #004ba0 100%)",
          py: { xs: 4, md: 5 },
          mt: 8,
          color: "#fff",
          borderTopLeftRadius: { xs: 16, md: 24 },
          borderTopRightRadius: { xs: 16, md: 24 },
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #42a5f5, #bbdefb, #42a5f5)",
          },
        }}
      >
        {/* Main footer content */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 3 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 6 }}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Brand and Social section */}
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                Student Project Shop
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, opacity: 0.9, maxWidth: 300 }}
              >
                Your one-stop platform for academic projects, resources, and
                collaboration.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Follow Us
                </Typography>
                <Stack direction="row" spacing={1}>
                  {social.map((s, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        href={s.href}
                        target={s.name !== "WhatsApp" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={
                          s.name === "WhatsApp"
                            ? (e) => {
                                e.preventDefault();
                                setWhatsappOpen(true);
                              }
                            : undefined
                        }
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "&:hover": {
                            backgroundColor: s.color,
                            color: "#fff",
                          },
                        }}
                        size="medium"
                        aria-label={s.name}
                      >
                        {s.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Payment Partner
                </Typography>
                <Box
                  component="img"
                  src="https://btmaxhost.com/wp-content/uploads/2023/11/SSL-Commerz-Pay-1024x194.webp"
                  alt="SSL Commerz Pay"
                  sx={{
                    maxWidth: 200,
                    height: "auto",
                    borderRadius: 1,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
              </Box>
            </Box>

            {/* Contact information */}
            <Box sx={{ flex: 1, minWidth: 250, }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Contact Info
              </Typography>

              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ mr: 1.5, fontSize: 20, opacity: 0.8 }} />
                  <Link
                    href="mailto:maharab@gmail.com"
                    underline="hover"
                    sx={{ color: "#fff", fontWeight: 500 }}
                  >
                    maharab@gmail.com
                  </Link>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone sx={{ mr: 1.5, fontSize: 20, opacity: 0.8 }} />
                  <Link
                    href="tel:+8801586282609"
                    underline="hover"
                    sx={{ color: "#fff", fontWeight: 500 }}
                  >
                    +880 1586 282609
                  </Link>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <LocationOn
                    sx={{ mr: 1.5, mt: 0.5, fontSize: 20, opacity: 0.8 }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Dhaka, Bangladesh
                  </Typography>
                </Box>
              </Stack>

              {/* Google Map Embed */}
              <Box sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
                <iframe
                  title="OpenStreetMap"
                  width="100%"
                  height="150"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.3750,23.7700,90.4500,23.8400&layer=mapnik&marker=23.8103,90.4125"
                  style={{ border: 0, display: "block" }}
                ></iframe>
              </Box>
            </Box>

            {/* Useful Links */}
            <Box sx={{ flex: -9, minWidth: 250, mt: -6 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Quick Links
              </Typography>

              <Stack spacing={1.5}>
                {usefulLinks.map((link) => (
                  <motion.div
                    key={link.label}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      component="button"
                      onClick={() => setPage(link.page)}
                      underline="none"
                      sx={{
                        color: "#fff",
                        opacity: 0.9,
                        fontWeight: 500,
                        textAlign: "left",
                        "&:hover": { opacity: 1, textDecoration: "underline" },
                        transition: "all 0.2s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Business Hours
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Sunday - Thursday
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  9:00 AM - 6:00 PM
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.2)" }} />

          {/* Copyright section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Made with{" "}
              <Favorite sx={{ color: "#ff4d4d", mx: 0.5, fontSize: 16 }} /> by
              <Box component="span" sx={{ fontWeight: 600, ml: 0.5 }}>
                Student Project Shop Team
              </Box>
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              &copy; {new Date().getFullYear()} Student Project Shop. All rights
              reserved.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* WhatsApp Dialog */}
      <Dialog
        open={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <WhatsApp sx={{ color: "#25d366", mr: 1, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            WhatsApp Message
          </Typography>
          <IconButton
            onClick={() => setWhatsappOpen(false)}
            sx={{ ml: "auto" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            label="Type your message"
            fullWidth
            multiline
            rows={3}
            value={whatsAppMsg}
            onChange={(e) => setWhatsAppMsg(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setWhatsappOpen(false)}>Cancel</Button>
          <Button
            onClick={handleWhatsAppSend}
            variant="contained"
            disabled={!whatsAppMsg.trim()}
            sx={{
              backgroundColor: "#25d366",
              "&:hover": { backgroundColor: "#128c7e" },
            }}
            startIcon={<WhatsApp />}
          >
            Send via WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
