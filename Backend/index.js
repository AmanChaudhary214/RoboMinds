const express = require("express");
const { connection } = require("./config/db");
const {chatRouter}=require('./routes/chat.route')
const { userRoute } = require("./routes/user.routes");
const {authMiddleWare}=require("./middlewares/jwt.middleware")
const cors = require("cors");
require("dotenv").config();
const app = express();



app.use(cors());
// app.use(
//   cors({
//     origin: ['http://127.0.0.1:5500', 'null'],
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//   })
// );


app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.send({ "ok": true, "msg": "Welcome to chatview" });
  } catch (error) {
    res.send({ "ok": false, "msg": error.message })
  }
})

app.use("/user", userRoute);
app.use(authMiddleWare)
app.use("/test",chatRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to MongoDb Database");
  } catch (error) {
    console.log(error.message);
    console.log("Database not Connected");
  }
  console.log(`Server is running at port ${process.env.PORT}`);
})