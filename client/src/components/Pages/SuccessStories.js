import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const stories = [
  {
    name: "Ayesha Rahman",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I sold my first web project here and got a job offer from a local company. Amazing platform!",
  },
  {
    name: "Tanvir Ahmed",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Student Project Shop helped me find inspiration for my thesis. The ML projects are top-notch.",
  },
  {
    name: "Nusrat Jahan",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "I bought an app template and learned so much by customizing it. Highly recommended!",
  },
  {
    name: "Rafiul Islam",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
    text: "The support team is very responsive. I found a great React project for my portfolio.",
  },
  {
    name: "Sumaiya Akter",
    img: "https://randomuser.me/api/portraits/women/50.jpg",
    text: "I uploaded my ML project and got valuable feedback from other students.",
  },
  {
    name: "Sabbir Hossain",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "The platform is easy to use and has a wide variety of projects.",
  },
  {
    name: "Rafiul Islam",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
    text: "The support team is very responsive. I found a great React project for my portfolio.",
  },
  {
    name: "Sumaiya Akter",
    img: "https://randomuser.me/api/portraits/women/50.jpg",
    text: "I uploaded my ML project and got valuable feedback from other students.",
  },
  {
    name: "Sabbir Hossain",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "The platform is easy to use and has a wide variety of projects.",
  },
];

function getCardsPerView() {
  if (window.innerWidth < 600) return 1;
  if (window.innerWidth < 900) return 2;
  if (window.innerWidth < 1200) return 3;
  return 5;
}

const AUTO_SLIDE_MS = 1000; // 4 seconds

export default function SuccessStories() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());
  const [isHovered, setIsHovered] = useState(false);

  // Responsive cards per view
  useEffect(() => {
    const update = () => {
      setCardsPerView(getCardsPerView());
      setIndex((prev) =>
        Math.min(prev, Math.max(0, stories.length - getCardsPerView()))
      );
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= stories.length - cardsPerView) return 0;
        return prev + 1;
      });
    }, AUTO_SLIDE_MS);
    return () => clearInterval(interval);
  }, [index, cardsPerView, isHovered]);

  // Reset progress on manual navigation
  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, stories.length - cardsPerView));
  };

  const currentStories = stories.slice(index, index + cardsPerView);

  // Colors for day/night
  const cardBg = theme.palette.mode === "dark" ? "#232b36" : "#fff";
  const btnBg = theme.palette.mode === "dark" ? "#2a3748" : "#f4f8fb";
  const btnHover = theme.palette.mode === "dark" ? "#1976d2" : "#e3f2fd";
  const btnColor = theme.palette.mode === "dark" ? "#fff" : "#1976d2";

  return (
    <Box sx={{ my: 6 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        align="center"
        color="primary"
        sx={{ mb: 3 }}
      >
        Success Stories
      </Typography>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ width: { xs: "100%", md: 1100 }, mx: "auto" }}
        >
          {currentStories.map((s, i) => (
            <Card
              key={s.name + i}
              sx={{
                flex: 1,
                minWidth: 220,
                maxWidth: 320,
                mx: "auto",
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: cardBg,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  src={s.img}
                  alt={s.name}
                  sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
                />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  {s.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  "{s.text.length > 40 ? s.text.slice(0, 40) + "..." : s.text}"
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Buttons below */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <IconButton
            onClick={handlePrev}
            disabled={index === 0}
            sx={{
              mx: 1,
              bgcolor: btnBg,
              color: btnColor,
              "&:hover": { bgcolor: btnHover, color: "#fff" },
              border: "1px solid",
              borderColor: theme.palette.divider,
              transition: "all 0.2s",
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={index >= stories.length - cardsPerView}
            sx={{
              mx: 1,
              bgcolor: btnBg,
              color: btnColor,
              "&:hover": { bgcolor: btnHover, color: "#fff" },
              border: "1px solid",
              borderColor: theme.palette.divider,
              transition: "all 0.2s",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
