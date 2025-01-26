import React, { useState } from "react";
import {
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Fab,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import images from the assets folder
import Image1 from "../assets/landscape1.jpg";
import Image2 from "../assets/landscape2.jpg";
import Image3 from "../assets/landscape3.jpg";

const Feed = () => {
  const [images, setImages] = useState([
    { id: 1, url: Image1, caption: "Beautiful Landscape 1" },
    { id: 2, url: Image2, caption: "Beautiful Landscape 2" },
    { id: 3, url: Image3, caption: "Beautiful Landscape 3" },
  ]);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [formCaption, setFormCaption] = useState("");

  const handleImageDialogOpen = (image) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  const handleFormDialogOpen = () => {
    setFormDialogOpen(true);
  };

  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
    setFormImage(null);
    setFormCaption("");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (formImage && formCaption) {
      const newImage = {
        id: images.length + 1,
        url: URL.createObjectURL(formImage),
        caption: formCaption,
      };

      setImages((prevImages) => [...prevImages, newImage]);
      handleFormDialogClose();
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Page Header */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold",
          color: "#3f51b5",
        }}
      >
        Feed Page
      </Typography>

      {/* Image List Section */}
      <ImageList cols={3} gap={16}>
        {images.map((image) => (
          <ImageListItem
            key={image.id}
            onClick={() => handleImageDialogOpen(image)}
            style={{
              cursor: "pointer",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={image.url}
              alt={image.caption}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Dialog to display selected image */}
      <Dialog open={imageDialogOpen} onClose={handleImageDialogClose} maxWidth="sm" fullWidth>
        <DialogContent
        sx={{
          backgroundColor: "#F2EFE7", // Light gray background
          borderRadius: "8px",
        }}>
          <Card
            style={{
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "12px",
            }}
          >
            <CardMedia
              component="img"
              height="400"
              image={selectedImage?.url}
              alt={selectedImage?.caption}
            />
            <CardContent>
              <Typography variant="h6" style={{ textAlign: "center", fontWeight: "bold" }}>
                {selectedImage?.caption}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Dialog with Form for Upload */}
      <Dialog open={formDialogOpen} onClose={handleFormDialogClose} maxWidth="sm" fullWidth>
        <DialogContent
        >
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom style={{ textAlign: "center", marginBottom: "20px" }}>
              Upload Image
            </Typography>
            <Button
              variant="contained"
              component="label"
              style={{
                marginBottom: "16px",
                backgroundColor: "#3f51b5",
                color: "#fff",
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFormImage(e.target.files[0])}
              />
            </Button>
            {formImage && (
              <Typography variant="body2" style={{ marginBottom: "16px" }}>
                {formImage.name}
              </Typography>
            )}
            <TextField
              label="Caption"
              variant="outlined"
              fullWidth
              value={formCaption}
              onChange={(e) => setFormCaption(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ alignSelf: "center", padding: "10px 30px" }}
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button (FAB) */}
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        }}
        onClick={handleFormDialogOpen}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default Feed;