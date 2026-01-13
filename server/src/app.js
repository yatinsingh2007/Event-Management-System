require('dotenv').config();
const { prisma } = require("./dbConfig/dbConfig")
const express = require('express');

const app = express();





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