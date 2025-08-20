import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  Alert,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";

export default function BkashPage({ total, onBack, handleBuy }) {
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [error, setError] = useState("");

  const bkashNumber = "+8801775596197";

  const handleCopy = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validateTransactionId = (id) => {
    // basic format validation
    const trimmed = id.trim();
    return /^[A-Za-z0-9]{8,}$/.test(trimmed); // bKash TXN ID is typically alphanumeric
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateTransactionId(transactionId)) {
      setError("Invalid transaction ID. Please double-check and try again.");
      return;
    }

    setConfirmDialog(true);
  };

  const confirmAndSubmit = async () => {
    setSubmitting(true);
    try {
      await handleBuy(transactionId); // handleBuy is passed in from parent
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setConfirmDialog(false);
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src="https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png"
          alt="bKash"
          style={{ width: 120, marginBottom: 16 }}
        />
        <Typography
          variant="h5"
          fontWeight={800}
          color="primary"
          sx={{ mb: 2 }}
        >
          bKash Payment
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Pay <strong style={{ color: "#43a047" }}>BDT {total}k</strong> to:
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" color="secondary">
            {bkashNumber}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon
                fontSize="small"
                color={copied ? "success" : "action"}
              />
            </IconButton>
          </Tooltip>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your transaction ID after payment.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="bKash Transaction ID"
            fullWidth
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            disabled={submitting}
          />
        </Stack>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{
            fontWeight: 700,
            py: 1.2,
            fontSize: 17,
            borderRadius: 2,
            boxShadow: 2,
            mb: 2,
          }}
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={handleSubmit}
          disabled={submitting || !transactionId}
        >
          {submitting ? "Processing..." : "Confirm Payment"}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onBack}
          disabled={submitting}
        >
          Back to Cart
        </Button>

        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 3, display: "block", fontStyle: "italic" }}
        >
          ⚠️ Submitting false/fake transaction IDs will result in order
          rejection and possible account ban.
        </Typography>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          Are you sure you want to confirm this transaction?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmAndSubmit}
            color="success"
            variant="contained"
          >
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
