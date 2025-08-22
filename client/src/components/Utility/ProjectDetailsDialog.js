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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  Close,
  AttachMoney,
  ShoppingCart,
  Schedule,
  Person,
  Star,
  CalendarToday,
} from "@mui/icons-material";

export default function ProjectDetailsDialog({ open, onClose, project }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          borderRadius: isMobile ? 0 : 2,
          background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          pt: 2.5,
          background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="600">
            {project.title}
          </Typography>
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
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={project.img}
                alt={project.title}
                sx={{
                  width: "100%",
                  height: 280,
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
                  <Chip key={i} label={lang} variant="outlined" size="small" />
                ))}
              </Stack>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Chip
                  icon={<AttachMoney />}
                  label={`BDT ${project.price}K`}
                  color="success"
                  variant="filled"
                  size="small"
                />
                <Chip
                  icon={<ShoppingCart />}
                  label={`Sold: ${project.sold || 0}K`}
                  color="secondary"
                  variant="filled"
                  size="small"
                />
                {project.duration && (
                  <Chip
                    icon={<Schedule />}
                    label={project.duration}
                    variant="filled"
                    size="small"
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
                />
                <Typography variant="body2" color="text.secondary">
                  ({project.rating?.toFixed(1) || "0.0"})
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight="600" gutterBottom>
                Project Stats
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card
                  variant="outlined"
                  sx={{ flex: 1, minWidth: 120, borderRadius: 2 }}
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
                  sx={{ flex: 1, minWidth: 120, borderRadius: 2 }}
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
                  sx={{ flex: 1, minWidth: 120, borderRadius: 2 }}
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

        <Box sx={{ px: 3, pb: 3 }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({project.reviews ? project.reviews.length : 0} reviews)
            </Typography>
          </Box>

          {project.reviews && project.reviews.length > 0 ? (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      Rating
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      Review
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.reviews
                    .slice()
                    .reverse()
                    .map((r, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1.5,
                                bgcolor: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              {r.userName
                                ? r.userName.charAt(0).toUpperCase()
                                : "A"}
                            </Avatar>
                            {r.userName || "Anonymous"}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating
                              value={r.rating || 0}
                              readOnly
                              size="small"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {r.rating?.toFixed(1)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{r.review}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarToday
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                color: "text.secondary",
                              }}
                            />
                            {r.date
                              ? new Date(r.date).toLocaleDateString()
                              : ""}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Card
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              <Person sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                No reviews yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to review this project!
              </Typography>
            </Card>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
