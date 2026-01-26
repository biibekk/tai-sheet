require("dotenv").config();
const express = require("express");
const pool = require("./db/pool");
const tournamentsRoutes = require("./routes/tournaments.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
app.use(express.json());

pool.query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection failed", err));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/tournaments", tournamentsRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
