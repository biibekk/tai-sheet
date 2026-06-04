require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const tournamentsRoutes = require("./routes/tournaments.routes");
const usersRoutes = require("./routes/users.routes");
const studentsRoutes = require("./routes/students.routes");
const drawRoutes = require("./routes/draw.routes");
const categoriesRoutes = require("./routes/categories.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(cors());
app.use(express.json());

// testing database connection
pool.query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection failed", err));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/tournaments", tournamentsRoutes);
app.use("/users", usersRoutes);
app.use("/students", studentsRoutes);

// mount router in main Express app
// endpoint: POST /draw/categories/:categoryId/generate-draw
app.use("/draw", drawRoutes);

app.use("/categories", categoriesRoutes);

app.use("/auth", authRoutes)

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
