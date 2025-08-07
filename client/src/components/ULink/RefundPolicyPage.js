import { Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Fade, Slide } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GavelIcon from "@mui/icons-material/Gavel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LockIcon from "@mui/icons-material/Lock";
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
            We value your trust and strive for transparency.
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="All sales are final."
                secondary="Once a project is purchased, it cannot be returned or exchanged except in specific cases below."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ReportProblemIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Refunds for incorrect or undelivered projects"
                secondary="If the delivered project does not match the description or is not delivered at all, you are eligible for a full refund."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="7-day refund window"
                secondary="You must contact our support team within 7 days of purchase to request a refund."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DownloadDoneIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="No refunds after download"
                secondary="Refunds are not available after the project files have been downloaded or accessed."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GavelIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Personal use only"
                secondary="All projects are for personal, educational, or research use only. Reselling or redistribution is strictly prohibited."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupportAgentIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Support before refund"
                secondary="If you face any technical issues, please contact our support team for help before requesting a refund."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="disabled" />
              </ListItemIcon>
              <ListItemText
                primary="Your access is protected"
                secondary="If a project is removed from our platform after your purchase, you will still have access to your download."
              />
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