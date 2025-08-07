import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";

export default function LegalTrust() {
  return (
    <Box
      sx={{
        my: 6,
        maxWidth: 900,
        mx: "auto",
        py: 4,
        px: { xs: 2, md: 4 },
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 2,
        textAlign: "center"
      }}
    >
      <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 3 }}>
        Legal & Trust
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="center"
        alignItems="stretch"
      >
        <Box flex={1}>
          <GavelIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={700}>Legal Compliance</Typography>
          <Typography variant="body2" color="text.secondary">
            We comply with all applicable laws and respect copyright. All projects are original or used with permission.
          </Typography>
        </Box>
        <Box flex={1}>
          <VerifiedUserIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={700}>Trusted Platform</Typography>
          <Typography variant="body2" color="text.secondary">
            Your data and payments are secure. We use trusted payment gateways and never share your information.
          </Typography>
        </Box>
        <Box flex={1}>
          <SecurityIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={700}>Safe Community</Typography>
          <Typography variant="body2" color="text.secondary">
            We review all projects and users to ensure a safe, positive experience for everyone.
          </Typography>
        </Box>
      </Stack>

      {/* Divider for separation */}
      <Divider sx={{ my: 4 }} />

      {/* Refund Policy Section */}
      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
          Refund Policy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We strive for your satisfaction. If you are not satisfied with your purchase, you may request a refund within 14 days of your transaction, provided the project has not been downloaded or used. Please contact our support team for assistance with refunds.
        </Typography>
      </Box>

      {/* Terms & Conditions Section */}
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
          Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By using our platform, you agree to abide by our community guidelines and all applicable laws. Projects must not infringe on intellectual property rights. We reserve the right to suspend accounts that violate our terms. For full details, please review our complete Terms & Conditions document.
        </Typography>
      </Box>
    </Box>
  );
}