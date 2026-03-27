const express = require("express");
const cors = require("cors");
require("./db");

const problemsRoutes = require("./routes/problems");
const revisionsRoutes = require("./routes/revisions");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5173",
        "http://localhost:8000",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the ReviseFlow backend API.",
  });
});

app.get("/health", (_req, res) => {
  res.json({ message: "ReviseFlow backend is running." });
});

app.use("/problems", problemsRoutes);
app.use("/revisions", revisionsRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`ReviseFlow backend listening on http://localhost:${PORT}`);
});
