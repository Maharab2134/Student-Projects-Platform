import React, { useState } from "react";
import { Box, Typography, Button, Stack, TextField, IconButton, Tooltip } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";

export default function BkashPage({ total, onBack, handleBuy }) {
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const bkashNumber = "+880 177 5596197"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
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
        textAlign: "center"
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png"
          alt="bKash"
          style={{ width: 120, marginBottom: 16 }}
        />
        <Typography variant="h5" fontWeight={800} color="primary" sx={{ mb: 2 }}>
          bKash Payment
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please pay <b style={{ color: "#43a047" }}>BDT {total}k</b> to the following bKash number:
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h6" color="secondary">
            {bkashNumber}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5 }}>
              <ContentCopyIcon fontSize="small" color={copied ? "success" : "action"} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          After payment, please enter your bKash Transaction ID below and click "Confirm Payment".
        </Typography>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="bKash Transaction ID"
            fullWidth
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
          />
        </Stack>
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ fontWeight: 700, py: 1.2, fontSize: 17, borderRadius: 2, boxShadow: 2, mb: 2 }}
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={() => handleBuy(transactionId)}
          disabled={!transactionId}
        >
          Confirm Payment
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onBack}
        >
          Back to Cart
        </Button>
      </motion.div>
    </Box>
  );
}