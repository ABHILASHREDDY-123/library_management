const express = require("express");
const sha1 = require("sha1");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const AdminTemp = require("../Schema/adminTempSchema");
const UserTemp = require("../Schema/userTempSchema");
const router = express.Router();
var nodemailer = require("node-mailer");
function sendemail(gmail,url){

 
var transport = nodemailer.createTransport(
  {
    service:'gmail',
    auth:{
      user:"gajulapallyabhilash1@gmail.com",
      pass:'Abhilash-1'
    }
  }
);
var mailOptions = {
  from:'gajulapallyabhilash@gmail.com',
  to:gmail,
  subject:"Verify Account",
  text:url

}
 transport.sendMail(mailOptions).then((err,info)=>{
  if(err){
   // console.log(err);
  }
   else{
   // console.log(info.response);
   }
})
}
router.post("/user/new",(req,res) =>{
  if(req.body.gmail===undefined){return res.send("Invalid Signup Credentials");}
    User.findOne({reg_no:req.body.reg_no}).then((resp)=>{
          if(resp===null){
            const text = new Date() + req.body.gmail;
            const token = sha1(text);
            let newuser = new UserTemp({
                gmail:req.body.gmail,
                name:req.body.name,
                password:req.body.password,
                reg_no:req.body.reg_no,
                token:token
            });
            const url = `http://localhost:8000/signup/user/verify/${token}`;
            newuser.save().then((resp)=>{
             return res.send("Verify your email");
            }).catch((err)=>{
           res.send({err});
            })
          }
          else{
            res.send("User with that registration number already exists");
          }
    })

});
router.post("/admin/new",(req,res)=>{
         if(req.body.gmail===undefined){return res.send("Invalid Signup Credentials");}
         Admin.findOne({gmail:req.body.gmail}).then((resp)=>{
            if(resp===null){
              const token = new Date() + req.body.gmail;
              const url = `http://localhost:8000/signup/admin/verify/${token}`;
             
                 let newadmin = new AdminTemp({name:req.body.name,gmail:req.body.gmail,password:req.body.password,token:token});
                 newadmin.save().then((admin)=>{
                return  res.send("Wait for your account activation by higher authority");
                 })
                 .catch((err)=>{
                  console.log(err);
                 })
            }
            else{
              return res.send("Account already exists on this email");
            }
         })
});
router.get("/user/verify/:token",(req,res)=>{
  const token = req.params.token;
  UserTemp.findOne({token:token}).then((resp)=>{
  if(resp===null){
    return res.send("Invalid Credentials");
  }
  else{
    let newuser = new User({gmail:resp.gmail,name:resp.name,password:resp.password,reg_no:resp.reg_no});
    newuser.save().then((user)=>{
      res.send("Account activated");
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  })
  .catch((err)=>{
    console.log(err);
  })
});
router.get("/admin/verify/:token",(req,res)=>{
  const token = req.params.token;
  AdminTemp.findOne({token:token}).then((resp)=>{
    if(resp===null){
      return res.send("Invalid Credentials");
    }
    else{
      let newadmin = new Admin({gmail:resp.gmail,name:resp.name,password:resp.password});
      newadmin.save().then((adm)=>{
        return res.send("Account activated");
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  })
})
module.exports = router;