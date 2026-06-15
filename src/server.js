import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Admissions backend running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
}

startServer();
