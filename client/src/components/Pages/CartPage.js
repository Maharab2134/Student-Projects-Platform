import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Button,
  Switch,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/system";

const StyledCartItem = styled(motion.div)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "16px",
  padding: "1rem",
  boxShadow: theme.shadows[1],
  background: theme.palette.background.paper,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

export default function CartPage({ cart, removeFromCart, handleBuy, setPage }) {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "20px",
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
              : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Shopping Cart
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          <Switch 
            checked={theme.palette.mode === 'dark'}
            onChange={toggleDarkMode}
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>

      {cart.length === 0 ? (
        <Box
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            <ShoppingCartCheckoutIcon
              sx={{ 
                fontSize: 60, 
                color: theme.palette.text.secondary 
              }}
            />
          </motion.div>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mt: 2 }}
          >
            Your cart feels lonely...
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: "12px",
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
              }
            }}
            onClick={() => setPage("home")}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <>
          <Stack spacing={2} sx={{ overflow: "hidden" }}>
            <AnimatePresence>
              {cart.map((p) => (
                <StyledCartItem
                  key={p._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Avatar
                    variant="rounded"
                    src={p.img}
                    alt={p.title}
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      border: `2px solid ${theme.palette.background.default}`,
                      boxShadow: theme.shadows[1],
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700} sx={{ mb: 0.5 }}>
                      {p.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize={15}>
                      BDT {p.price}K
                    </Typography>
                  </Box>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(p._id)}
                      sx={{
                        "&:hover": {
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 0, 0, 0.2)'
                            : 'rgba(255, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </motion.div>
                </StyledCartItem>
              ))}
            </AnimatePresence>
          </Stack>

          <Divider
            sx={{
              my: 3,
              borderColor: theme.palette.divider,
              borderBottomWidth: "2px",
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              p: 2,
              borderRadius: "12px",
              background: theme.palette.action.hover,
            }}
          >
            <Typography fontWeight={700} fontSize={18}>
              Total:
            </Typography>
            <Typography
              fontWeight={700}
              fontSize={20}
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #64B5F6 30%, #4FC3F7 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BDT {total}k
            </Typography>
          </Box>

          <Button
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              fontWeight: 700,
              py: 1.3,
              fontSize: 17,
              borderRadius: "12px",
              boxShadow: theme.shadows[2],
              textTransform: "none",
              letterSpacing: "0.5px",
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }}
            startIcon={
              <ShoppingCartCheckoutIcon
                sx={{
                  transition: "transform 0.3s",
                  ".MuiButton-contained:hover &": {
                    transform: "translateX(5px)",
                  },
                }}
              />
            }
            onClick={() => setPage("bkash")}
          >
            Proceed to bKash Payment
          </Button>
        </>
      )}
    </Box>
  );
}