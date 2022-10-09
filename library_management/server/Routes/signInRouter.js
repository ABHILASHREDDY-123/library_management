const express = require("express");

const jwt= require("jsonwebtoken");
var expressJwt = require("express-jwt");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
router.get("/user/:reg_no",(req,res)=>{
    const reg_no = req.params.reg_no;
     User.findOne({reg_no:reg_no}).then((resp)=>{
        if(resp===null){
            res.send("No User exists with that registration number");
        }
        else{
            if(resp.password===req.body.password){
               const token = jwt.sign({_id:resp._id},process.env.JWT_KEY,{algorithm:"HS256"});
               res.cookie("library",{expires:new Date()+9999});
               const {_id,name,gmail} = resp;
               return res.json({token,user:{_id,name,gmail}});
            }
            else{
                res.send("Incorrect Credentials");
            }
        }
     })
});
router.get("/admin",(req,res)=>{
    Admin.findOne({gmail:req.body.gmail}).then((resp)=>{
        if(resp===null){return res.send("Account on that email doesn't exists");}
        else{
            if(resp.password===req.body.password){
                 const token = jwt.sign({_id:resp._id},process.env.JWT_KEY_ADMIN,{algorithm:"HS256"});
                 const date = new Date();
                 res.cookie("libadmin",{expires:date+9999});
                 const {_id,name,gmail} = resp;
                 return res.json({token,admin:{_id,name,gmail}});
            }
            else{
                return res.send("Invalid LogIn Credentials");
            }
        }
    })
})

module.exports = router;