const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const mongourl = process.env.MONGO_URL;
const signInRouter  = require("./Routes/signInRouter");
const signUpRouter = require("./Routes/signUpRouter");
const adminRouter = require("./Routes/adminRouter");
const userRouter = require("./Routes/userRouter");
const forgotRouter = require("./Routes/forgotRouter");
mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log("Connected to database");
});

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/signin",signInRouter);
app.use("/signup",signUpRouter);
app.use("/forgot",forgotRouter);
app.use("/admin/",adminRouter);
app.use("/users/",userRouter);
app.use("/",(req,res)=>{
    res.send("Home page");
});
app.listen(process.env.PORT,()=>{
console.log("Server started");
})

