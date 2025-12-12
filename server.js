const app = require("./app");
const connectDB = require("./config/db");

const PORT = 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
