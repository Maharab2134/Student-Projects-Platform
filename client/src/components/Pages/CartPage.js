import React from "react";
import { Box, Typography, Stack, Avatar, IconButton, Divider, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function CartPage({ cart, removeFromCart, handleBuy, setPage }) {
  return (
    <Box sx={{
      maxWidth: 600,
      mx: "auto",
      mt: 4,
      p: 3,
      border: "1px solid #e0e0e0",
      borderRadius: 3,
      boxShadow: 3,
      minHeight: 200,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}>
      <Typography variant="h4" fontWeight={800} align="center" sx={{ mb: 3, color: "primary.main" }}>
        My Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Stack spacing={2}>
            {cart.map(p => (
              <Box
                key={p._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1.5,
                  boxShadow: 1,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={p.img}
                  alt={p.title}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    border: "1px solid #e0e0e0",
                    bgcolor: "#f5f5f5",
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={700} sx={{ mb: 0.5 }}>
                    {p.title}
                  </Typography>
                  <Typography color="text.secondary" fontSize={15}>
                    BDT {p.price}K
                  </Typography>
                </Box>
                <IconButton color="error" onClick={() => removeFromCart(p._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography fontWeight={700} fontSize={18}>
              Total:
            </Typography>
            <Typography fontWeight={700} fontSize={20} color="primary">
              BDT {cart.reduce((sum, p) => sum + p.price, 0)}k
            </Typography>
          </Box>
         <Button
         variant="contained" 
         color="success"
         fullWidth
         sx={{ fontWeight: 700, py: 1.3, fontSize: 17, borderRadius: 2, boxShadow: 2 }}
         startIcon={<ShoppingCartCheckoutIcon />} onClick={() => setPage("bkash")}>
          Pay with bKash
          </Button>
        </>
      )}
    </Box>
  );
}