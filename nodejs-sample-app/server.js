const express = require("express");
const cors = require("cors");
require("dotenv").config();

const EGainAuth = require("./auth");
const EGainService = require("./egainService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize services
const authService = new EGainAuth();
const egainService = new EGainService(authService);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "eGain Node.js Sample Application",
    version: "1.0.0",
    endpoints: {
      "GET /health": "Health check",
      "GET /chunks": "Get chunks",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Get chunks
app.get("/chunks", async (req, res) => {
  try {
    let query = req.query.q;
    const chunks = await egainService.retrieveChunks(query);
    res.json({
      success: true,
      data: chunks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching chunks:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 eGain Node.js Sample Server running on port ${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
