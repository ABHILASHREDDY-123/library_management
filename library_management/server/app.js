const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const mongourl = "mongodb+srv://tarun:tarun@cluster0.6qzotrb.mongodb.net/?retryWrites=true&w=majority"
const signInRouter  = require("./Routes/signInRouter");
const signUpRouter = require("./Routes/signUpRouter");
const adminRouter = require("./Routes/adminRouter");
const userRouter = require("./Routes/userRouter");
mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log("Connected to database");
});
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/signin",signInRouter);
app.use("/signup",signUpRouter);

app.use("/admin/",adminRouter);
app.use("/users/",userRouter);
app.use("/",(req,res)=>{
    res.send("Home page");
});
app.listen(8000,()=>{
console.log("Server started");
})

