import React from "react";
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
} from "@mui/icons-material";

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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ProjectDetailsDialog({ open, onClose, project }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(to bottom, #121212, #1e1e1e)"
                : "linear-gradient(to bottom, #f9fafb, #ffffff)",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            maxHeight: isMobile ? "100vh" : "90vh",
          },
        }}
        scroll="paper"
      >
        <div id="back-to-top-anchor" />
        <DialogTitle
          sx={{
            pb: 1,
            pt: isMobile ? 1 : 2.5,
            background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
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
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="600"
              sx={{
                flex: 1,
                textAlign: isMobile ? "center" : "left",
                pr: isMobile ? 4 : 0,
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
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, overflowX: "hidden" }}>
          <Box sx={{ p: isMobile ? 2 : 3 }}>
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={project.img}
                  alt={project.title}
                  sx={{
                    width: "100%",
                    height: isMobile ? 200 : 280,
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    label={project.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  {project.language?.map((lang, i) => (
                    <Chip
                      key={i}
                      label={lang}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>

                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    icon={
                      <AttachMoney
                        sx={{ fontSize: isMobile ? "16px" : "20px" }}
                      />
                    }
                    label={`BDT ${project.price}K`}
                    color="success"
                    variant="filled"
                    size={isMobile ? "small" : "medium"}
                  />
                  <Chip
                    icon={
                      <ShoppingCart
                        sx={{ fontSize: isMobile ? "16px" : "20px" }}
                      />
                    }
                    label={`Sold: ${project.sold || 0}K`}
                    color="secondary"
                    variant="filled"
                    size={isMobile ? "small" : "medium"}
                  />
                  {project.duration && (
                    <Chip
                      icon={
                        <Schedule
                          sx={{ fontSize: isMobile ? "16px" : "20px" }}
                        />
                      }
                      label={project.duration}
                      variant="filled"
                      size={isMobile ? "small" : "medium"}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Project Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {project.desc}
                </Typography>

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
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Project Stats
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  <Card
                    variant="outlined"
                    sx={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : 120,
                      borderRadius: 2,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Completion Rate
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          sx={{ mr: 1 }}
                        >
                          98%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={98}
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      flex: 1,
                      minWidth: isMobile ? "calc(50% - 8px)" : 120,
                      borderRadius: 2,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Revisions
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        {project.revisions || 2}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      flex: 1,
                      minWidth: isMobile ? "calc(50% - 8px)" : 120,
                      borderRadius: 2,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Support
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        24/7
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ px: isMobile ? 2 : 3, pb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{ mb: 2 }}
            >
              <Tab label="Reviews" />
              <Tab label="Details" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mr: 1 }}>
                  Customer Reviews
                </Typography>
                <Chip
                  icon={<Star sx={{ fontSize: 16 }} />}
                  label={averageRating}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({project.reviews ? project.reviews.length : 0} reviews)
                </Typography>
              </Box>

              {project.reviews && project.reviews.length > 0 ? (
                <Stack spacing={2}>
                  {project.reviews
                    .slice()
                    .reverse()
                    .map((r, idx) => (
                      <Fade in key={idx} timeout={500}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  mr: 1.5,
                                  bgcolor: "primary.main",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {r.userName
                                  ? r.userName.charAt(0).toUpperCase()
                                  : "A"}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
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
                            <Typography variant="body2" sx={{ pl: 5.5 }}>
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
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                  }}
                >
                  <Person
                    sx={{
                      fontSize: 48,
                      color:
                        theme.palette.mode === "dark"
                          ? "grey.500"
                          : "text.secondary",
                      mb: 1,
                    }}
                  />
                  <Typography
                    color={
                      theme.palette.mode === "dark"
                        ? "grey.400"
                        : "text.secondary"
                    }
                    gutterBottom
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
                  >
                    Be the first to review this project!
                  </Typography>
                </Card>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Project Details
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ color: "text.secondary" }}
              >
                This project includes comprehensive features and full
                documentation. The package comes with source code, installation
                guide, and 6 months of technical support.
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 3 }}
              >
                What's Included
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbUp color="primary" sx={{ fontSize: 20, mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Full source code
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbUp color="primary" sx={{ fontSize: 20, mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Documentation
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbUp color="primary" sx={{ fontSize: 20, mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    6 months support
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ThumbUp color="primary" sx={{ fontSize: 20, mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Future updates
                  </Typography>
                </Box>
              </Stack>
            </TabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
