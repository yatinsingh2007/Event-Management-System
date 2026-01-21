require("dotenv").config();
const { prisma } = require("./dbConfig/dbConfig");
const express = require("express");
const cors = require("cors");


const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");

const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();


app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to Event Management System",
  });
});

// Mount routes
app.use("/api", userRoutes);
app.use("/api", eventRoutes);

async function main() {
  await prisma.$connect();
  console.log("Connected to Database successfully!");
  app.listen(process.env.PORT, () => {
    console.log("Server is Listening");
  });
}

main()
  .catch((err) => console.log(err))
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = app;
