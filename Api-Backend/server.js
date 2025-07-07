const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const bodyParser = require("body-parser"); // Removed - express.json() is sufficient
require("dotenv").config(); // Load environment variables from .env file

// --- Import Routers ---
const studentsRoutes = require("./routers/studentRoutes");
const authRouter = require("./routers/AuthRouters");
const feedbackRoutes = require("./routers/FeedbackRoutes");
const chatbotRoutes = require("./routers/chatbot"); // Correctly imported chatbot routes
const geminiRoutes = require("./routers/Ai-interview-pre"); // Renamed variable for clarity

// --- Initialize Express App ---
const app = express();

// --- Define Port (allow environment variable override) ---
const PORT = process.env.PORT || 3100; // Use environment port or default to 3100

// --- Middleware Setup ---
app.use(cookieParser());

// CORS Configuration:
// WARNING: For production, replace "*" with your specific frontend domain(s) for security.
// Using credentials: true with origin: "*" is generally insecure.
app.use(cors({
    origin: "*", // Consider changing for production, e.g., "http://localhost:4200" or your deployed frontend URL
    credentials: true
}));

app.use(express.json()); // Built-in middleware for parsing JSON request bodies
// app.use(bodyParser.json()); // Removed - Redundant with express.json()

// Serve the 'uploads' folder as a static directory
// Requests to e.g., /uploads/image.jpg will serve the file from ./uploads/image.jpg
app.use('/uploads', express.static('uploads'));

// --- API Routes Registration ---
app.use("/api/auth", authRouter);
app.use("/api/students", studentsRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/gemini", geminiRoutes); // Use the renamed variable
app.use("/api/chatbot", chatbotRoutes); // Register chatbot routes

// --- Global Error Handler Middleware ---
// This should generally be defined AFTER all other app.use() and routes
app.use((err, req, res, next) => {
  console.error("--- Global Error Handler Caught An Error ---");
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error("Error Message:", err.message);
  console.error("Error Stack:", err.stack);
  // Avoid sending the raw error stack to the client in production
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message: message }); // Send a generic message
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server Running on localhost:${PORT}`);
    // Assuming your database connection logic is handled elsewhere (e.g., in a separate config file or called at startup)
    // If you have a connection function, you might call it here or ensure it's called before listen.
    // Example: connectDB().then(() => console.log("Database connected successfully!"));
    // Based on your previous logs, it seems database connection happens implicitly or before this.
});

// Optional: Handle unhandled promise rejections (good practice)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Optional: Handle uncaught exceptions (good practice)
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, cleanup, and graceful shutdown logic here
  process.exit(1); // Mandatory exit after uncaught exception
});