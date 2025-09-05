import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Rating,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Fab,
  Tabs,
  Tab,
  useScrollTrigger,
  Zoom,
  Fade,
  Grow,
  Slide,
  alpha,
  Button,
} from "@mui/material";
import {
  Close,
  AttachMoney,
  ShoppingCart,
  Schedule,
  Person,
  Star,
  CalendarToday,
  ArrowBack,
  ThumbUp,
  Favorite,
  Share,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { keyframes } from "@emotion/react";

// Floating animation for cards
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Pulse animation for loading
const pulseAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

// Custom fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function ScrollTop({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <Slide direction="up" in={value === index} mountOnEnter unmountOnExit>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    </Slide>
  );
}

export default function ProjectDetailsDialog({ open, onClose, project }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (open) {
      setImageLoaded(false);
      setContentLoaded(false);
      // Simulate loading for animation purposes
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, project]);

  if (!project) return null;

  // Calculate average rating
  const averageRating =
    project.reviews && project.reviews.length > 0
      ? (
          project.reviews.reduce((sum, review) => sum + review.rating, 0) /
          project.reviews.length
        ).toFixed(1)
      : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 1.5,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to bottom, #1a1a2e, #16213e)"
              : "linear-gradient(to bottom, #f8fafc, #ffffff)",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxHeight: isMobile ? "100vh" : "90vh",
          transform: "scale(0.95)",
          animation: open ? `${fadeIn} 0.3s ease-out forwards` : "none",
        },
      }}
      scroll="paper"
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      <div id="back-to-top-anchor" />
      <DialogTitle
        sx={{
          pb: 1,
          pt: isMobile ? 2 : 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {isMobile && (
            <IconButton
              aria-label="back"
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                transition: "all 0.2s ease",
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="700"
            sx={{
              flex: 1,
              textAlign: isMobile ? "center" : "left",
              pr: isMobile ? 4 : 0,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {project.title}
          </Typography>
          {!isMobile && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflowX: "hidden" }}>
        <Box sx={{ p: isMobile ? 2 : 4 }}>
          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    "& .project-image": {
                      transform: "scale(1.05)",
                    },
                    "& .project-actions": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Box
                  component="img"
                  src={project.img}
                  alt={project.title}
                  className="project-image"
                  onLoad={() => setImageLoaded(true)}
                  sx={{
                    width: "100%",
                    height: isMobile ? 220 : 320,
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    opacity: imageLoaded ? 1 : 0,
                    animation: imageLoaded ? `${fadeIn} 0.5s ease` : "none",
                  }}
                />
                {!imageLoaded && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: isMobile ? 220 : 320,
                      bgcolor: "grey.200",
                      animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
                    }}
                  />
                )}

                <Box
                  className="project-actions"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    display: "flex",
                    gap: 1,
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.8),
                      color: "white",
                      "&:hover": { bgcolor: theme.palette.error.main },
                    }}
                  >
                    <Favorite />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.8),
                      color: "white",
                      "&:hover": { bgcolor: theme.palette.primary.main },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              <Grow in={contentLoaded} timeout={500}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    label={project.category}
                    color="primary"
                    variant="filled"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  {project.language?.map((lang, i) => (
                    <Chip
                      key={i}
                      label={lang}
                      variant="outlined"
                      size="small"
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "white",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Grow>

              <Grow in={contentLoaded} timeout={600}>
                <Box
                  sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}
                >
                  <Chip
                    icon={
                      <AttachMoney
                        sx={{ fontSize: isMobile ? "16px" : "18px" }}
                      />
                    }
                    label={`BDT ${project.price}K`}
                    color="success"
                    variant="filled"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      fontWeight: 600,
                      animation: `${floatAnimation} 3s ease-in-out infinite`,
                      animationDelay: "0.5s",
                    }}
                  />
                  <Chip
                    icon={
                      <ShoppingCart
                        sx={{ fontSize: isMobile ? "16px" : "18px" }}
                      />
                    }
                    label={`Sold: ${project.sold || 0}K`}
                    color="secondary"
                    variant="filled"
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontWeight: 600 }}
                  />
                  {project.duration && (
                    <Chip
                      icon={
                        <Schedule
                          sx={{ fontSize: isMobile ? "16px" : "18px" }}
                        />
                      }
                      label={project.duration}
                      variant="filled"
                      size={isMobile ? "small" : "medium"}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Grow>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in={contentLoaded} timeout={700}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Project Description
                  </Typography>
                  <Box sx={{ mb: 2, color: "text.secondary", lineHeight: 1.7 }}>
                    <ReactMarkdown
                      children={project.desc}
                      components={{
                        p: ({ node, ...props }) => (
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 2,
                              color: "text.secondary",
                              lineHeight: 1.7,
                              fontSize: isMobile ? "0.9rem" : "1rem",
                            }}
                            {...props}
                          />
                        ),
                        h1: ({ node, ...props }) => (
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            gutterBottom
                            sx={{ color: "primary.main", mt: 2 }}
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            gutterBottom
                            sx={{ color: "primary.main", mt: 2 }}
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li
                            style={{ marginBottom: 8, lineHeight: 1.6 }}
                            {...props}
                          />
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={project.rating || 0}
                      precision={0.1}
                      readOnly
                      sx={{ mr: 1 }}
                      size={isMobile ? "small" : "medium"}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({project.rating?.toFixed(1) || "0.0"})
                    </Typography>
                    <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                      <Star color="warning" sx={{ mr: 0.5, fontSize: 20 }} />
                      <Typography variant="body2" fontWeight="600">
                        {averageRating} average
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>

              <Divider
                sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }}
              />

              <Fade in={contentLoaded} timeout={800}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{ color: "primary.main", mb: 2 }}
                  >
                    Project Stats
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        minWidth: isMobile ? "100%" : 140,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        background:
                          "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Completion Rate
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            sx={{ mr: 1, fontWeight: 700 }}
                          >
                            98%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={98}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            color="primary"
                          />
                        </Box>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        minWidth: isMobile ? "calc(50% - 8px)" : 140,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        background:
                          "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Revisions
                        </Typography>
                        <Typography
                          variant="h6"
                          color="warning.main"
                          sx={{ fontWeight: 700 }}
                        >
                          {project.revisions || 2}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        minWidth: isMobile ? "calc(50% - 8px)" : 140,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        background:
                          "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.04)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Support
                        </Typography>
                        <Typography
                          variant="h6"
                          color="success.main"
                          sx={{ fontWeight: 700 }}
                        >
                          24/7
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: isMobile ? 2 : 4, pb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: isMobile ? "0.9rem" : "1rem",
                minHeight: 48,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Reviews" icon={<Person />} iconPosition="start" />
            <Tab label="Details" icon={<ThumbUp />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mr: 1, color: "primary.main" }}
              >
                Customer Reviews
              </Typography>
              <Chip
                icon={<Star sx={{ fontSize: 16 }} />}
                label={averageRating}
                size="small"
                color="primary"
                variant="filled"
                sx={{ mr: 1, fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({project.reviews ? project.reviews.length : 0} reviews)
              </Typography>
            </Box>

            {project.reviews && project.reviews.length > 0 ? (
              <Stack spacing={2}>
                {project.reviews
                  .slice()
                  .reverse()
                  .map((r, idx) => (
                    <Fade
                      in
                      key={idx}
                      timeout={500}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to right, rgba(30, 30, 30, 0.5), rgba(30, 30, 30, 0.3))"
                              : "linear-gradient(to right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4))",
                          backdropFilter: "blur(10px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.divider, 0.1),
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                mr: 2,
                                bgcolor: "primary.main",
                                fontSize: "1rem",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              }}
                            >
                              {r.userName
                                ? r.userName.charAt(0).toUpperCase()
                                : "A"}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {r.userName || "Anonymous"}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <Rating
                                  value={r.rating || 0}
                                  readOnly
                                  size="small"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ ml: 1, mr: 2 }}
                                >
                                  {r.rating?.toFixed(1)}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <CalendarToday
                                    sx={{
                                      fontSize: 14,
                                      mr: 0.5,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {r.date
                                      ? new Date(r.date).toLocaleDateString()
                                      : ""}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ pl: 7, lineHeight: 1.7 }}
                          >
                            {r.review}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  ))}
              </Stack>
            ) : (
              <Card
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(to right, rgba(30, 30, 30, 0.5), rgba(30, 30, 30, 0.3))"
                      : "linear-gradient(to right, rgba(248, 250, 252, 0.7), rgba(241, 245, 249, 0.4))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                }}
              >
                <Person
                  sx={{
                    fontSize: 48,
                    color:
                      theme.palette.mode === "dark"
                        ? "grey.500"
                        : "primary.light",
                    mb: 2,
                  }}
                />
                <Typography
                  color={
                    theme.palette.mode === "dark" ? "grey.300" : "text.primary"
                  }
                  gutterBottom
                  variant="h6"
                >
                  No reviews yet.
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    theme.palette.mode === "dark"
                      ? "grey.500"
                      : "text.secondary"
                  }
                  sx={{ mb: 2 }}
                >
                  Be the first to review this project!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Write a Review
                </Button>
              </Card>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Project Details
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              This project includes comprehensive features and full
              documentation. The package comes with source code, installation
              guide, and 6 months of technical support.
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ mt: 4, color: "primary.main" }}
            >
              What's Included
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                "Full source code",
                "Documentation",
                "6 months support",
              ].map((item, index) => (
                <Fade
                  in
                  key={index}
                  timeout={500}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ThumbUp color="primary" sx={{ fontSize: 24, mr: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      {item}
                    </Typography>
                  </Box>
                </Fade>
              ))}
            </Stack>
          </TabPanel>
        </Box>
      </DialogContent>

      <ScrollTop>
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <ArrowBack sx={{ transform: "rotate(90deg)" }} />
        </Fab>
      </ScrollTop>
    </Dialog>
  );
}
