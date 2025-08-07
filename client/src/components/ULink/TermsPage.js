import { Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Fade, Slide } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";

export default function RefundPolicyPage() {
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
            Refund Policy
          </Typography>
        </div>
      </Slide>
      <Fade in={show} timeout={1000}>
        <div>
          <Divider sx={{ mb: 3, mx: "auto", width: 80, borderColor: "primary.main", opacity: 0.4 }} />
          <Typography
            variant="h6"
            fontWeight={600}
            color="secondary"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Please read our refund policy carefully.
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="All sales are final." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Refunds are only provided if the delivered project does not match the description or is not delivered at all." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="You must contact our support team within 7 days of purchase for any refund requests." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Refunds are not available for change of mind or after the project files have been downloaded." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="All projects are for personal, educational, or research use only. Reselling or redistribution is strictly prohibited." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="If you face any technical issues with your purchased project, please contact our support team for assistance before requesting a refund." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Ownership of the project remains with the original creator. You are granted a license to use the project as described." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="If a project is removed from our platform after your purchase, you will still have access to your download." />
            </ListItem>
          </List>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: 17,
              textAlign: "center",
              lineHeight: 1.7,
              mt: 2,
            }}
          >
            For any questions or to request a refund, please contact us at{" "}
            <a href="mailto:your@email.com" style={{ color: "#1976d2", textDecoration: "none" }}>
              your@email.com
            </a>
            .
          </Typography>
        </div>
      </Fade>
    </Box>
  );
}