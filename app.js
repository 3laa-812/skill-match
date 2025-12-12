const express = require("express");
const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/api/auth.routes"));
app.use("/api/users", require("./routes/api/user.routes"));
app.use("/api/jobs", require("./routes/api/jobs.routes"));
app.use("/api/skills", require("./routes/api/skills.routes"));
app.use("/api/matching", require("./routes/api/matching.routes"));

app.get("/", (req, res) => {
  res.send("Skill-Match API is running...");
});

module.exports = app;
