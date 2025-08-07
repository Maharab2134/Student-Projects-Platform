import React from "react";
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
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

const CATEGORIES = ["Web", "App", "ML"];
const LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Dart",
  "Kotlin",
  "Swift",
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
      <Box
        component="form"
        onSubmit={onAdd}
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}
      >
        <TextField
          label="Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject((f) => ({ ...f, title: e.target.value }))
          }
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={newProject.category || ""}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, category: e.target.value }))
            }
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
            renderValue={(selected) => selected.join(", ")}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 10 }}>
          <TextField
            label="Price"
            type="number"
            value={newProject.price}
            onChange={(e) =>
              setNewProject((f) => ({ ...f, price: e.target.value }))
            }
          />
        </FormControl>
        <TextField
          label="Image URL"
          value={newProject.img}
          onChange={(e) =>
            setNewProject((f) => ({ ...f, img: e.target.value }))
          }
        />
        <TextField
          label="Duration"
          value={newProject.duration || ""}
          onChange={(e) =>
            setNewProject((f) => ({ ...f, duration: e.target.value }))
          }
        />
        <TextField
          label="Sold"
          type="number"
          value={newProject.sold || ""}
          onChange={(e) =>
            setNewProject((f) => ({ ...f, sold: e.target.value }))
          }
          sx={{ minWidth: 100 }}
        />
        <TextField
          label="Description"
          value={newProject.desc}
          onChange={(e) =>
            setNewProject((f) => ({ ...f, desc: e.target.value }))
          }
          multiline
          minRows={2}
          maxRows={4}
          fullWidth
          sx={{minWidth: 190, maxWidth: 290 }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          sx={{
            minWidth: 120,
            maxWidth: 150,
            alignSelf: "flex-end",
            height: 45,
            px: 4,
            marginBottom: 2,
          }}
        >
          Add
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p._id}>
              <TableCell>
                <TextField
                  defaultValue={p.title}
                  onBlur={(e) =>
                    onUpdate(p._id, { ...p, title: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  defaultValue={p.desc}
                  onBlur={(e) =>
                    onUpdate(p._id, { ...p, desc: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={p.category || ""}
                  onChange={(e) =>
                    onUpdate(p._id, { ...p, category: e.target.value })
                  }
                  sx={{ minWidth: 80 }}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  multiple
                  value={p.language || []}
                  onChange={(e) =>
                    onUpdate(p._id, { ...p, language: e.target.value })
                  }
                  sx={{ minWidth: 100 }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  defaultValue={p.price}
                  onBlur={(e) =>
                    onUpdate(p._id, { ...p, price: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  defaultValue={p.img}
                  onBlur={(e) => onUpdate(p._id, { ...p, img: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <TextField
                  defaultValue={p.duration || ""}
                  onBlur={(e) =>
                    onUpdate(p._id, { ...p, duration: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  defaultValue={p.sold || ""}
                  onBlur={(e) =>
                    onUpdate(p._id, { ...p, sold: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(p._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
