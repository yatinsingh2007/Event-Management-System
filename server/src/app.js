require('dotenv').config();
const { prisma } = require("./dbConfig/dbConfig")
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin : "http://localhost:5173"
}));
app.use(express.json());
app.get("/api/getAllUsers" , async (req , res) => {
    try{
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
});

app.post("/api/createUser" , async (req , res) => {
    try{
        const { name } = req.body;
        if (!name) return res.status(400).json({
            "error" : "Name is required"
        })
        const user = await prisma.user.create({
            data : {
                name
            }
        })
        return res.status(201).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
});


app.post("/api/createEvent" , async (req , res) => {
    try{
        const { users , startAt , endAt } = req.body;
        if (users.length === 0) return res.status(400).json({
            "error" : "At least one user is required"
        });

        const event = await prisma.event.create({
            data : {
               
            }
        })
        return res.status(201).json(event);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

async function main(){
    await prisma.$connect();
    console.log("Connected to Database successfully!");
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}

main()
.catch((err) => console.log(err))
.finally(async() => {
    await prisma.$disconnect();
})