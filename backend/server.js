const app = require("./app");
const connectDB = require("./config/db");
const config = require("config");

const PORT = config.get("port") || process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}`;
const mongoURI = config.get("mongoURI");

(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully!");
    try {
      const dbName = new URL(mongoURI).pathname.replace("/", "") || "unknown";
      console.log(`📍 Database: ${dbName}`);
    } catch {
      console.log(`📍 Database: skill_match_db`);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API URL: ${API_URL}`);
  });
})();
