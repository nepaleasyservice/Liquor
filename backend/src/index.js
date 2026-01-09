import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
