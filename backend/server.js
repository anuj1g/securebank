require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { initSocket } = require("./socket/socketHandler");

const queueRoutes = require("./routes/queueRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const counterRoutes = require("./routes/counterRoutes");
const staffRoutes = require("./routes/staffRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/queue", queueRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/counters", counterRoutes);
app.use("/api/staff", staffRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

initSocket(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
