const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./config/db");

connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use("/uploads/members", express.static("uploads/members"));
app.use("/uploads/news", express.static("uploads/news"));
app.use("/uploads/users", express.static("uploads/users"));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/members", require("./routes/members"));
app.use("/api/news", require("./routes/news"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // app.use("/uploads/members", express.static("uploads/members"));
  // app.use("/uploads/news", express.static("uploads/news"));
  // app.use("/uploads/users", express.static("uploads/users"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at ${PORT}...`));
