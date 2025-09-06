import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
  Stack,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import ReactMarkdown from "react-markdown";

export default function ProjectGrid({
  projects,
  addToCart,
  user,
  openLogin,
  selectedCategory,
  search,
  projectRatings,
  setSelectedProject,
  setProjectDialogOpen,
  loading,
}) {
  const [expandedDesc, setExpandedDesc] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const filtered = projects.filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      (!search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(search.toLowerCase())))
  );

  const getGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "1fr 1fr";
    return "1fr 1fr 1fr 1fr";
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: getGridColumns(),
        gap: 4,
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
      }}
    >
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => (
          <Card
            key={i}
            sx={{ height: 420, borderRadius: 1, boxShadow: "none" }}
          >
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: "12px 12px 0 0" }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="text" width="80%" height={28} />
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{ mt: 2.5, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        ))
      ) : filtered.length === 0 ? (
        <Box
          sx={{
            gridColumn: "1/-1",
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 2,
              fontWeight: 500,
            }}
          >
            No projects found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </Typography>
        </Box>
      ) : (
        filtered.map((project, i) => {
          // Safe handling of potentially undefined projectRatings
          const ratingData = projectRatings
            ? projectRatings.find((r) => r.projectId === project._id)
            : null;
          const averageRating = ratingData?.averageRating || 0;
          const ratingCount = ratingData?.ratingCount || 0;

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 1,
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {/* Image with overlay */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={project.img}
                    alt={project.title}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={`BDT ${project.price}K`}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "rgba(255, 255, 255, 0.92)",
                        color: "#388e3c",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ p: 2, flexGrow: 1, pb: 1 }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: 18,
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2rem",
                    }}
                  >
                    {project.title}
                  </Typography>

                  {/* Description with expand functionality */}
                  <Box sx={{ mb: 0.2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <ReactMarkdown>
                        {expandedDesc === project._id
                          ? project.desc
                          : project.desc.length > 120
                          ? `${project.desc.substring(0, 120)}...`
                          : project.desc}
                      </ReactMarkdown>
                    </Typography>
                  </Box>

                  {/* Category & Language chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    gap={1}
                    sx={{ mb: 2, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={project.category}
                      size="small"
                      sx={{
                        fontSize: 12,
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    {(project.language || []).map((lang, idx) => (
                      <Chip
                        key={idx}
                        label={lang}
                        size="small"
                        sx={{
                          fontSize: 12,
                          backgroundColor: "secondary.light",
                          color: "secondary.contrastText",
                          fontWeight: 600,
                          mb: 1,
                        }}
                      />
                    ))}
                  </Stack>

                  {/* Duration, Rating and Sold */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    {project.duration && (
                      <Chip
                        label={project.duration}
                        size="small"
                        sx={{
                          fontSize: 12,
                          bgcolor: "#1976d2",
                          color: "#fff",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      {projectRatings && (
                        <Tooltip
                          title={
                            ratingData && ratingCount > 0
                              ? `Average rating from order(s)`
                              : "No ratings yet"
                          }
                        >
                          <span>
                            <Rating
                              value={averageRating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                          </span>
                        </Tooltip>
                      )}
                      <Chip
                        label={`Sold: ${project.sold || 0}K`}
                        size="small"
                        sx={{
                          fontSize: 12,
                          bgcolor: "#f3ebecff",
                          color: "#b71c1c",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />
                </CardContent>

                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  {!user?.isAdmin && (
                    <Tooltip
                      title={
                        user
                          ? "Add this project to your cart"
                          : "Login to purchase"
                      }
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddShoppingCartIcon />}
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          py: 1,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          user ? addToCart(project) : openLogin();
                        }}
                        component={motion.div}
                        whileTap={{ scale: 0.97 }}
                      >
                        {user ? "Add to Cart" : "Login to Buy"}
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip title="View project details">
                    <IconButton
                      color="primary"
                      sx={{
                        ml: 1,
                        backgroundColor: "action.hover",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                        },
                      }}
                      onClick={() => {
                        setSelectedProject(project);
                        setProjectDialogOpen(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </motion.div>
          );
        })
      )}
    </Box>
  );
}
