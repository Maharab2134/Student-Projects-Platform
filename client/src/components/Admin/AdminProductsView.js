import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  ListSubheader,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete from "@mui/material/Autocomplete";

const CATEGORIES = ["Web", "App", "ML"];

// Categorized languages
const CATEGORIZED_LANGUAGES = [
  {
    category: "App Development",
    languages: [
      "Java",
      "Kotlin",
      "Swift",
      "Flutter",
      "React Native",
      "PHP (Api)",
    ],
  },
  {
    category: "Web Development",
    languages: [
      "HTML",
      "React",
      "Next.js",
      "Node.js",
      "PHP",
      "Express.js",
      "JavaScript",
      "TypeScript",
      "Django (Python)",
    ],
  },
  {
    category: "Machine Learning",
    languages: ["TensorFlow", "PyTorch", "Scikit-learn", "Python"],
  },
  {
    category: "Database",
    languages: ["MySQL", "PostgreSQL", "Firebase", "SQLite", "MongoDB"],
  },
  {
    category: "Design & Styling",
    languages: [
      "CSS",
      "XML",
      "Sass",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
    ],
  },
];

const DURATION_OPTIONS = [
  "7 days",
  "10 days",
  "15 days",
  "1 month",
  "2 months",
  "Other",
];

export default function AdminProductsView({
  projects,
  onAdd,
  onUpdate,
  onDelete,
  newProject,
  setNewProject,
}) {
  const [editingProject, setEditingProject] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleEditClick = (project) => {
    setEditingProject({ ...project });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = () => {
    onUpdate(editingProject._id, editingProject);
    setOpenEditDialog(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    onDelete(deleteConfirm);
    setDeleteConfirm(null);
  };

  // Render categorized menu items for the language select
  const renderLanguageMenuItems = () => {
    return CATEGORIZED_LANGUAGES.map((categoryGroup) => [
      <ListSubheader key={categoryGroup.category}>
        {categoryGroup.category}
      </ListSubheader>,
      ...categoryGroup.languages.map((lang) => (
        <MenuItem key={lang} value={lang}>
          {lang}
        </MenuItem>
      )),
    ]);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={800}
        align="center"
        sx={{ mb: 4, color: "primary.main" }}
      >
        Manage Products
      </Typography>

      {/* Add New Product Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Product
        </Typography>
        <Box
          component="form"
          onSubmit={onAdd}
          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          <TextField
            label="Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, title: e.target.value }))
            }
            required
            sx={{ minWidth: 340 }}
          />

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={newProject.category || ""}
              onChange={(e) =>
                setNewProject((f) => ({ ...f, category: e.target.value }))
              }
              required
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Language</InputLabel>
            <Select
              label="Language"
              multiple
              value={newProject.language || []}
              onChange={(e) =>
                setNewProject((f) => ({ ...f, language: e.target.value }))
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              required
            >
              {renderLanguageMenuItems()}
            </Select>
          </FormControl>

          <TextField
            label="Price"
            type="number"
            value={newProject.price}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, price: e.target.value }))
            }
            required
            sx={{ minWidth: 120, maxWidth: 150 }}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Image URL"
            value={newProject.img}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, img: e.target.value }))
            }
            required
            sx={{ minWidth: 250 }}
          />

          <Autocomplete
            freeSolo
            options={DURATION_OPTIONS}
            value={newProject.duration || ""}
            onInputChange={(_, value) =>
              setNewProject((f) => ({ ...f, duration: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Duration"
                sx={{ minWidth: 180 }}
                required
              />
            )}
          />

          <TextField
            label="Sold"
            type="number"
            value={newProject.sold === undefined ? "" : newProject.sold}
            onChange={(e) =>
              setNewProject((f) => ({
                ...f,
                sold:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            sx={{ minWidth: 100, maxWidth: 140 }}
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Description"
            value={newProject.desc}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, desc: e.target.value }))
            }
            multiline
            minRows={1}
            fullWidth
            required
            sx={{ minWidth: 300, maxWidth: 450 }}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            sx={{
              mt: 1,
              px: 4,
              height: 45,
            }}
          >
            Add Product
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {p.language?.map((lang) => (
                      <Chip key={lang} label={lang} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>BDT {p.price}K</TableCell>
                <TableCell>{p.duration}</TableCell>
                <TableCell>{p.sold || 0}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(p)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(p._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              value={editingProject?.title || ""}
              sx={{ flex: 1, minWidth: 150, maxWidth: 710 }}
              onChange={(e) =>
                setEditingProject((f) => ({ ...f, title: e.target.value }))
              }
              fullWidth
              required
            />

            <Box sx={{ display: "flex", gap: 10 }}>
              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={editingProject?.category || ""}
                  onChange={(e) =>
                    setEditingProject((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  label="Language"
                  multiple
                  value={editingProject?.language || []}
                  onChange={(e) =>
                    setEditingProject((f) => ({
                      ...f,
                      language: e.target.value,
                    }))
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  required
                >
                  {renderLanguageMenuItems()}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 20 }}>
              <TextField
                label="Price"
                type="number"
                value={editingProject?.price || 0}
                onChange={(e) =>
                  setEditingProject((f) => ({ ...f, price: e.target.value }))
                }
                required
                inputProps={{ min: 0 }}
                sx={{ flex: 1, minWidth: 120, maxWidth: 180 }}
              />

              <Autocomplete
                freeSolo
                options={DURATION_OPTIONS}
                value={editingProject?.duration || ""}
                onChange={(_, value) =>
                  setEditingProject((f) => ({ ...f, duration: value }))
                }
                onInputChange={(_, value) =>
                  setEditingProject((f) => ({ ...f, duration: value }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Duration"
                    sx={{ flex: 1, minWidth: 120, maxWidth: 180 }}
                  />
                )}
                sx={{ flex: 0.3 }}
              />

              <TextField
                label="Sold"
                type="number"
                value={editingProject?.sold || 0}
                onChange={(e) =>
                  setEditingProject((f) => ({ ...f, sold: e.target.value }))
                }
                sx={{ flex: 1, minWidth: 120, maxWidth: 180 }}
                InputProps={{
                  endAdornment: <span style={{ marginLeft: 4 }}>k</span>,
                }}
              />
            </Box>

            <TextField
              label="Image URL"
              value={editingProject?.img || ""}
              onChange={(e) =>
                setEditingProject((f) => ({ ...f, img: e.target.value }))
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={editingProject?.desc || ""}
              onChange={(e) =>
                setEditingProject((f) => ({ ...f, desc: e.target.value }))
              }
              multiline
              minRows={3}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
