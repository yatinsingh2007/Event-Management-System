require("dotenv").config();
const { prisma } = require("./dbConfig/dbConfig");
const express = require("express");
const cors = require("cors");
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.get("/api/getAllUsers", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/api/createUser", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({
        error: "Name is required",
      });
    const user = await prisma.user.create({
      data: {
        name,
      },
    });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/api/createEvent", async (req, res) => {
  try {
    const { users, startAt, endAt } = req.body;
    if (users.length === 0)
      return res.status(400).json({
        error: "At least one user is required",
      });

    const usersData = await prisma.user.findMany({
      where: {
        name: {
          in: users,
        },
      },
      select: {
        id: true,
      },
    });

    const event = await prisma.event.create({
      data: {
        users: {
          connect: usersData,
        },
        start: new Date(startAt + ":00"),
        end: new Date(endAt + ":00"),
      },
      include: {
        users: true,
      },
    });
    return res.status(201).json(event);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/api/getEvent", async (req, res) => {
  try {
    const { users } = req.body;
    const events = await prisma.event.findMany({
      where: {
        users: {
          some: {
            name: {
              in: users,
            },
          },
        },
      },
      include: {
        users: true,
      },
    });
    return res.status(200).json(events);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/api/getEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json(event);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/updateEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { users, startAt, endAt } = req.body;
    console.log(users);
    const usersData = await prisma.user.findMany({
      where: {
        name: {
          in: users,
        },
      },
      select: {
        id: true,
      },
    });
    console.log(usersData);
    const event = await prisma.event.update({
      where: { id },
      data: {
        users: {
          set: usersData,
        },
        start: new Date(startAt + ":00"),
        end: new Date(endAt + ":00"),
      },
      include: { users: true },
    });
    return res.status(200).json(event);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/deleteEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.delete({
      where: { 
        id 
      },
    });
    return res.status(200).json(event);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function main() {
  await prisma.$connect();
  console.log("Connected to Database successfully!");
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

main()
  .catch((err) => console.log(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
