// src/components/AssistantPage.js
import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./App.css";

function AssistantPage() {
  const navigate = useNavigate(); // Hook to navigate between routes

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw", 
        backgroundColor: "#000", // Black background for full effect
        textAlign: "center",
        color: "#FFFFFF",
      }}
    >
      {/* Back Arrow Button */}
      <IconButton
        onClick={() => navigate("/")} // Go back to homepage
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "#FFFFFF",
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      {/* Centered Text */}
      <Typography variant="h5" sx={{ fontWeight: "300", marginBottom: "5px" }}>
        Welcome to EchoNJ
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: "400" }}>
        How can I help you? <span style={{ fontWeight: "300" }}></span>
      </Typography>

      {/* Twisting and Glowing Blue Circle */}
      <div className="infinity-circle"></div>
    </Box>
  );
}

export default AssistantPage;
