import React, { useState, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig"; // Your Firebase storage instance
import { getAuth } from "firebase/auth"; // Firebase authentication import
import { db } from "../firebaseConfig"; // Firebase Firestore import
import { collection, addDoc } from "firebase/firestore"; // Firestore methods

const Feed = () => {
  const [images, setImages] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [formCaption, setFormCaption] = useState("");

  const auth = getAuth(); // Get Firebase auth instance
  const user = auth.currentUser; // Get current authenticated user

  useEffect(() => {
    if (user) {
      // Fetch image URLs from Firebase Storage on component mount for the authenticated user
      const fetchImages = async () => {
        const imagesRef = ref(storage, `images/${user.email}/`); // User-specific folder
        const imageList = await listAll(imagesRef); // List all images in the user's folder

        const imageUrls = await Promise.all(
          imageList.items.map(async (imageRef) => {
            const url = await getDownloadURL(imageRef); // Get the download URL for each image
            return { url };
          })
        );

        setImages(imageUrls); // Update state with the image URLs
      };

      fetchImages();
    }
  }, [user]);

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (user && formImage && formCaption) {
      const imageRef = ref(storage, `images/${user.email}/${formImage.name}`); // User-specific folder and image name

      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, formImage);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);

      const newImage = {
        url: imageUrl, // Use the Firebase storage URL
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
        {images.map((image, index) => (
          <ImageListItem
            key={index}
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
          }}
        >
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
        <DialogContent>
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
