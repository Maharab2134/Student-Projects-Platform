import {
  Box,
  Typography,
  Divider,
  Fade,
  Slide,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box sx={{ py: 6, maxWidth: 800, mx: "auto", px: 2 }}>
      <Slide in={show} direction="down" timeout={600}>
        <div>
          <Typography
            variant="h3"
            fontWeight={800}
            color="primary"
            gutterBottom
            sx={{
              letterSpacing: 1,
              textAlign: "center",
              fontFamily: "Poppins, Inter, Arial, sans-serif",
            }}
          >
            Privacy & App Privacy Policy
          </Typography>
        </div>
      </Slide>
      <Fade in={show} timeout={1000}>
        <div>
          <Divider
            sx={{
              mb: 3,
              mx: "auto",
              width: 80,
              borderColor: "primary.main",
              opacity: 0.4,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="secondary"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Your privacy is our priority.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#444",
              fontSize: 18,
              mb: 2,
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            We are committed to protecting your personal information and your
            right to privacy. This policy explains how we collect, use, and
            safeguard your data when you use Student Project Shop.
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            What Information We Collect
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary="Personal Information"
                secondary="Name, email address, phone number, and other details you provide during registration or profile updates."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Project Data"
                secondary="Information about the projects you upload, share, or purchase on our platform."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Usage Data"
                secondary="Information about how you use our website, including pages visited, features used, and device/browser details."
              />
            </ListItem>
          </List>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            How We Use Your Information
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary="To provide and improve our services"
                secondary="We use your data to operate, maintain, and enhance the platform experience."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="To communicate with you"
                secondary="We may send you updates, notifications, and support messages."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="To ensure security"
                secondary="We use your information to detect and prevent fraud, abuse, or other harmful activities."
              />
            </ListItem>
          </List>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            How We Protect Your Data
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: 17,
              mb: 2,
              textAlign: "left",
              lineHeight: 1.7,
            }}
          >
            We use industry-standard security measures, including encryption and
            secure servers, to protect your personal information. Access to your
            data is limited to authorized personnel only.
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            Sharing Your Information
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: 17,
              mb: 2,
              textAlign: "left",
              lineHeight: 1.7,
            }}
          >
            We do not sell or share your personal information with third
            parties, except as required by law or with your explicit consent.
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            Your Rights & Choices
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: 17,
              mb: 2,
              textAlign: "left",
              lineHeight: 1.7,
            }}
          >
            You can access, update, or delete your personal information at any
            time from your account settings. You may also contact us to request
            data removal or to ask questions about your privacy.
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mt: 4, mb: 1, textAlign: "left" }}
          >
            Changes to This Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: 17,
              mb: 2,
              textAlign: "left",
              lineHeight: 1.7,
            }}
          >
            We may update this privacy policy from time to time. We will notify
            you of any significant changes by posting the new policy on this
            page.
          </Typography>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={700}
              sx={{ letterSpacing: 1 }}
            >
              Thank you for trusting Student Project Shop.
            </Typography>
            <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
              If you have any questions or concerns about your privacy, please
              contact us at{" "}
              <a
                href="mailto:studentcrafted@gmail.com"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                studentcrafted@gmail.com
              </a>
              .
            </Typography>
          </Box>
        </div>
      </Fade>
    </Box>
  );
}
