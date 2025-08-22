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
  useMediaQuery,
  Chip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const stories = [
  {
    name: "Ayesha Rahman",
    university: "Dhaka University",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    text: "I sold my first web project here and got a job offer from a local company. Amazing platform!",
    rating: 5,
    field: "Web Development",
  },
  {
    name: "Ehsanul Haque",
    university: "BUBT",
    img: "https://res.cloudinary.com/dyl34zggp/image/upload/v1755613872/image2_uc9odd.jpg",
    text: "Student Project Shop helped me find inspiration for my thesis. The ML projects are top-notch.",
    rating: 4,
    field: "App Development",
  },
  {
    name: "Nusrat Jahan",
    university: "NSU",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29tYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    text: "I bought an app template and learned so much by customizing it. Highly recommended!",
    rating: 5,
    field: "Web Development",
  },
  {
    name: "Hasanuzzaman Sojeeb",
    university: "BUBT",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    text: "The support team is very responsive. I found a great React project for my portfolio.",
    rating: 4,
    field: "Frontend Development",
  },
  {
    name: "Sumaiya Akter",
    university: "BRAC University",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    text: "I uploaded my ML project and got valuable feedback from other students.",
    rating: 5,
    field: "Data Science",
  },
  {
    name: "Muhibur Hasan Roman",
    university: "BUBT",
    img: "https://res.cloudinary.com/dyl34zggp/image/upload/v1755688897/Muhibur_Hasan_Roman_mw1tny.webp",
    text: "The platform is easy to use and has a wide variety of projects.",
    rating: 4,
    field: "App Development",
  },
  {
    name: "Jubayer Ahmed",
    university: "BUBT",
    img: "https://res.cloudinary.com/dyl34zggp/image/upload/v1755870401/IMG_20250408_152150_996_melskp.webp",
    text: "I learned a lot from the ML projects here. Very helpful for my thesis.",
    rating: 5,
    field: "ML",
  },
  {
    name: "Nabila Tasnim",
    university: "NSU",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "The App templates are very easy to customize. Loved it!",
    rating: 4,
    field: "App Development",
  },
  {
    name: "Rafiq Islam",
    university: "BUET",
    img: "https://images.unsplash.com/photo-1531256379411-d48c5cfc5b6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "Web projects here gave me a boost for my portfolio.",
    rating: 5,
    field: "Web Development",
  },
  {
    name: "Sharmin Akter",
    university: "BRAC University",
    img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "The Data Science projects are very practical and well explained.",
    rating: 5,
    field: "Data Science",
  },
  {
    name: "Aminul Haque",
    university: "BUBT",
    img: "https://images.unsplash.com/photo-1614282834234-d8658fbe52bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "I improved my React skills using frontend projects from this platform.",
    rating: 4,
    field: "Frontend Development",
  },
  {
    name: "Farhana Sultana",
    university: "NSU",
    img: "https://images.unsplash.com/photo-1621609766131-53b30f4db9ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "App development projects are easy to follow and well structured.",
    rating: 5,
    field: "App Development",
  },
  {
    name: "Arif Chowdhury",
    university: "DU",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "ML projects helped me understand algorithms practically.",
    rating: 5,
    field: "ML",
  },
  {
    name: "Lamia Rahman",
    university: "BUET",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    text: "Web project templates saved me a lot of development time.",
    rating: 4,
    field: "Web Development",
  },
];

const AUTO_SLIDE_MS = 3000; // 5 seconds

export default function SuccessStories() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Determine cards per view based on screen size
  let cardsPerView = 4; // default
  if (isMobile) cardsPerView = 1;
  else if (isTablet) cardsPerView = 2;

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
  const cardBg = theme.palette.mode === "dark" ? "#2a3441" : "#ffffff";
  const sectionBg = theme.palette.mode === "dark" ? "#1a202c" : "#f8fafc";
  const accentColor = theme.palette.mode === "dark" ? "#4f8ff0" : "#2563eb";

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        backgroundColor: sectionBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(37, 99, 235, 0.1)"
              : "rgba(37, 99, 235, 0.05)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(37, 99, 235, 0.1)"
              : "rgba(37, 99, 235, 0.05)",
          zIndex: 0,
        }}
      />

      <Typography
        variant="h3"
        fontWeight={800}
        align="center"
        color="primary"
        sx={{
          mb: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        Success Stories
      </Typography>

      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{
          maxWidth: 600,
          mx: "auto",
          mb: 5,
          position: "relative",
          zIndex: 1,
        }}
      >
        Discover how students are achieving their goals and advancing their
        careers with our platform
      </Typography>

      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrev}
          disabled={index === 0}
          sx={{
            position: "absolute",
            left: { xs: 0, md: -50 },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: theme.palette.background.paper,
            color: accentColor,
            boxShadow: 2,
            "&:hover": {
              backgroundColor: accentColor,
              color: "#fff",
            },
            zIndex: 2,
            display: { xs: "none", md: "flex" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          disabled={index >= stories.length - cardsPerView}
          sx={{
            position: "absolute",
            right: { xs: 0, md: -50 },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: theme.palette.background.paper,
            color: accentColor,
            boxShadow: 2,
            "&:hover": {
              backgroundColor: accentColor,
              color: "#fff",
            },
            zIndex: 2,
            display: { xs: "none", md: "flex" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            width: { xs: "100%", md: "90%" },
            mx: "auto",
            position: "relative",
          }}
        >
          {currentStories.map((s, i) => (
            <Card
              key={s.name + i}
              sx={{
                flex: 1,
                minWidth: 280,
                maxWidth: 380,
                mx: "auto",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                bgcolor: cardBg,
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative",
                overflow: "visible",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {/* Quote icon */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: 2,
                }}
              >
                <FormatQuoteIcon sx={{ fontSize: 30 }} />
              </Box>

              <CardContent sx={{ textAlign: "center", pt: 5, pb: 3 }}>
                <Avatar
                  src={s.img}
                  alt={s.name}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    border: `3px solid ${accentColor}`,
                    boxShadow: 2,
                  }}
                />

                {/* Rating stars */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  {[...Array(5)].map((_, starIndex) => (
                    <StarIcon
                      key={starIndex}
                      sx={{
                        fontSize: 18,
                        color: starIndex < s.rating ? "#ffc107" : "#e0e0e0",
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ mb: 0.5 }}
                >
                  {s.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block", fontWeight: 500 }}
                >
                  {s.university}
                </Typography>

                <Chip
                  label={s.field}
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(79, 143, 240, 0.2)"
                        : "rgba(37, 99, 235, 0.1)",
                    color: accentColor,
                    fontWeight: 500,
                    mb: 2,
                    fontSize: "0.7rem",
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    mt: 1,
                    minHeight: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      marginRight: 6,
                      color: accentColor,
                      lineHeight: 0,
                    }}
                  >
                    &ldquo;
                  </span>
                  {s.text}
                  <span
                    style={{
                      fontSize: 24,
                      marginLeft: 6,
                      color: accentColor,
                      lineHeight: 0,
                    }}
                  >
                    &rdquo;
                  </span>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Mobile navigation buttons */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            mt: 4,
          }}
        >
          <IconButton
            onClick={handlePrev}
            disabled={index === 0}
            sx={{
              mx: 1,
              bgcolor: "background.paper",
              color: accentColor,
              boxShadow: 1,
              "&:hover": { bgcolor: accentColor, color: "#fff" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={index >= stories.length - cardsPerView}
            sx={{
              mx: 1,
              bgcolor: "background.paper",
              color: accentColor,
              boxShadow: 1,
              "&:hover": { bgcolor: accentColor, color: "#fff" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Dots indicator */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {Array.from({ length: stories.length - cardsPerView + 1 }).map(
            (_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  mx: 0.5,
                  backgroundColor: i === index ? accentColor : "grey.400",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: i === index ? accentColor : "grey.600",
                  },
                }}
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
