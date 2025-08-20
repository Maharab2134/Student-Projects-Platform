import React, { useState } from "react";
import { Box, Typography, Button, Chip, Tooltip, Stack } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";

export default function ProjectGrid({
  projects,
  addToCart,
  user,
  openLogin,
  selectedCategory,
  search,
  projectRatings,
}) {
  const [expandedDesc, setExpandedDesc] = useState(null);
  const [expandedTitle, setExpandedTitle] = useState(null);

  const filtered = projects.filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      (!search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(search.toLowerCase())))
  );

  // Function to check if title needs truncation
  const needsTruncation = (title) => {
    if (!title) return false;
    const wordCount = title.split(/\s+/).length;
    return wordCount > 4 || title.length > 26;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
          lg: "1fr 1fr 1fr 1fr",
        },
        gap: 4,
        px: { xs: 1.5, sm: 3, md: 5 },
        py: 2,
      }}
    >
      {filtered.length === 0 && (
        <Typography
          sx={{
            gridColumn: "1/-1",
            textAlign: "center",
            color: "text.secondary",
            mt: 4,
          }}
        >
          No projects found.
        </Typography>
      )}
      {filtered.map((project, i) => {
        const shouldTruncateTitle = needsTruncation(project.title);

        return (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                borderRadius: 1,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: 420,
                position: "relative",
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: 180,
                  "&:hover img": {
                    transform: "scale(1.06)",
                  },
                }}
              >
                <img
                  src={project.img}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
                <Chip
                  label={`BDT ${project.price}K`}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    px: 1.5,
                    py: 0.3,
                    bgcolor: "#ffffff",
                    color: "#388e3c",
                    boxShadow: 1,
                    borderRadius: 2,
                  }}
                />
              </Box>

              {/* Content */}
              <Box
                sx={{
                  p: 2.2,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "100%",
                }}
              >
                {/* Title with expand/collapse functionality */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                    fontSize: 18,
                    mb: 0.8,
                    overflow: "hidden",
                    whiteSpace:
                      expandedTitle === project._id ? "normal" : "nowrap",
                    textOverflow: "ellipsis",
                    width: "100%",
                    cursor: shouldTruncateTitle ? "pointer" : "default",
                    maxHeight: expandedTitle === project._id ? "none" : "1.5em",
                    lineHeight: "1.5em",
                  }}
                  onClick={() => {
                    if (shouldTruncateTitle) {
                      setExpandedTitle(
                        expandedTitle === project._id ? null : project._id
                      );
                    }
                  }}
                >
                  {expandedTitle === project._id
                    ? project.title
                    : shouldTruncateTitle
                    ? project.title.slice(0, 26) + " ..."
                    : project.title}
                  {shouldTruncateTitle && (
                    <span
                      style={{
                        color: "#1976d2",
                        marginLeft: 4,
                        fontWeight: 600,
                        fontSize: "0.9em",
                      }}
                    >
                      {expandedTitle === project._id ? "..." : ""}
                    </span>
                  )}
                </Typography>

                {/* Expand/Collapse Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "#fff" : "#333",
                    minHeight: 44,
                    maxHeight: expandedDesc === project._id ? "none" : 44,
                    overflow:
                      expandedDesc === project._id ? "visible" : "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: expandedDesc === project._id ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                    mb: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    wordBreak: "break-word",
                    width: "100%",
                    textAlign: "justify",
                  }}
                  onClick={() =>
                    setExpandedDesc(
                      expandedDesc === project._id ? null : project._id
                    )
                  }
                >
                  {expandedDesc === project._id
                    ? project.desc
                    : project.desc.length > 90
                    ? project.desc.slice(0, 90) + "..."
                    : project.desc}
                  {project.desc.length > 90 && (
                    <span
                      style={{
                        color: "#1976d2",
                        marginLeft: 4,
                        fontWeight: 600,
                      }}
                    >
                      {expandedDesc === project._id
                        ? " Show less"
                        : " Read more"}
                    </span>
                  )}
                </Typography>

                {/* Category and Language */}
                <Stack
                  direction="row"
                  spacing={1}
                  rowGap={1.4}
                  sx={{
                    mb: 1.5,
                    flexWrap: "wrap",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={project.category}
                    size="small"
                    sx={{
                      fontSize: 12,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      fontWeight: 600,
                    }}
                  />
                  {(project.language || []).map((lang, idx) => (
                    <Chip
                      key={idx}
                      label={lang}
                      size="small"
                      sx={{
                        fontSize: 12,
                        bgcolor: "#ede7f6",
                        color: "#6a1b9a",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>

                {/* Duration, Rating and Sold - arranged horizontally with proper spacing */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    gap: 1,
                    width: "100%",
                  }}
                >
                  {/* Duration */}
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

                  {/* Rating and Sold */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    {/* Rating */}
                    {projectRatings && (
                      <Tooltip
                        title={(() => {
                          const r = projectRatings.find(
                            (r) => r.projectId === project._id
                          );
                          return r && r.ratingCount > 0
                            ? `Average rating from order(s)`
                            : "No ratings yet";
                        })()}
                      >
                        <span>
                          <Rating
                            value={
                              projectRatings.find(
                                (r) => r.projectId === project._id
                              )?.averageRating * 1 || 0
                            }
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                        </span>
                      </Tooltip>
                    )}

                    {/* Sold */}
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

                {/* Add to Cart Button (not for admin) */}
                {!user?.isAdmin && (
                  <Tooltip
                    title={
                      user ? "Add this project to your cart" : "Login to buy"
                    }
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddShoppingCartIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 1.1,
                        fontSize: 15,
                        textTransform: "none",
                        boxShadow: "none",
                        transition: "0.2s ease",
                        "&:hover": {
                          background: "#1565c0",
                        },
                      }}
                      onClick={user ? () => addToCart(project) : openLogin}
                      component={motion.button}
                      whileTap={{ scale: 0.96 }}
                    >
                      {user ? "Add to Cart" : "Login to Buy"}
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
