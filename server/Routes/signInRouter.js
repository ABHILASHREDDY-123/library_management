const express = require("express");

const jwt= require("jsonwebtoken");
var expressJwt = require("express-jwt");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
router.post("/user/",(req,res)=>{
     User.findOne({gmail:req.body.gmail}).then((resp)=>{
        if(resp===null){
            res.send({error:"No User exists with that registration number",err:1});
        }
        else{
            if(resp.password===req.body.password){
               const token = jwt.sign({_id:resp._id},process.env.JWT_KEY,{algorithm:"HS256"});
               res.cookie("library",{expires:new Date()+9999});
               const {_id,name,gmail,reg_no} = resp;
               const isuser=1;
               return res.json({token,user:{_id,name,gmail,isuser,reg_no}});
            }
            else{
                res.send({error:"Incorrect Credentials",err:1});
            }
        }
     })
});
router.post("/admin",(req,res)=>{
    Admin.findOne({gmail:req.body.gmail}).then((resp)=>{
        if(resp===null){return res.send({error:"Account on that email doesn't exists",err:1});}
        else{
            if(resp.password===req.body.password){
                 const token = jwt.sign({_id:resp._id},process.env.JWT_KEY_ADMIN,{algorithm:"HS256"});
                 const date = new Date();
                 res.cookie("libadmin",{expires:date+9999});
                 const {_id,name,gmail} = resp;
                 return res.json({token,admin:{_id,name,gmail}});
            }
            else{
                return res.send({error:"Invalid LogIn Credentials",err:1});
            }
        }
    })
})

module.exports = router;