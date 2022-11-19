const express = require("express");
const dotenv = require("dotenv");
const sha1 = require("sha1");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const AdminTemp = require("../Schema/adminTempSchema");
const UserTemp = require("../Schema/userTempSchema");
const router = express.Router();
var nodemailer = require("nodemailer");
dotenv.config();
function sendemail(gmail,url){
var transport = nodemailer.createTransport(
  {
    service:'gmail',
    auth:{
      user:process.env.GMAIL,
      pass:process.env.PASSWORD
    }
  }
);
var mailOptions = {
  from:process.env.GMAIL,
  to:gmail,
  subject:"Verify Account",
  text:url

}
 transport.sendMail(mailOptions).then((err,info)=>{
  if(err){
   // console.log(err);
  }
   else{
//  console.log(info.response);
   }
})
}
function sendemailadmin(url){
  var transport = nodemailer.createTransport(
    {
      service:'gmail',
      auth:{
        user:process.env.GMAIL,
        pass:process.env.PASSWORD
      }
    }
  );
  var mailOptions = {
    from:process.env.GMAIL,
    to:process.env.SUPERADMINGMAIL,
    subject:"Verify Account",
    text:url
  
  }
   transport.sendMail(mailOptions).then((err,info)=>{
    if(err){
     // console.log(err);
    }
     else{
  //  console.log(info.response);
     }
  })
  }
router.post("/user/new",(req,res) =>{
  if(req.body.gmail===undefined){return res.send("Invalid Signup Credentials");}
    User.findOne({reg_no:req.body.reg_no}).then((resp)=>{
          if(resp===null){
            const text = String(new Date().getMilliseconds()) + req.body.gmail;
            const token = sha1(text);
            
            const url = `http://localhost:${process.env.PORT}/signup/user/verify/${token}`;
            UserTemp.findOne({reg_no:req.body.reg_no}).then((x)=>{
              if(x!==null){
                x.name = req.body.name;
                x.gmail = req.body.gmail;
                x.password = req.body.password;
                x.token = token;
                x.save().then((z)=>{
                  sendemail(req.body.gmail,url);
                  return res.send("Email has been sent for verification");
                }).catch((err)=>{console.log(err);})
              }
              else{
                let newuser = new UserTemp({
                  gmail:req.body.gmail,
                  name:req.body.name,
                  password:req.body.password,
                  reg_no:req.body.reg_no,
                  token:token
              });
  
              newuser.save().then((resp)=>{
                sendemail(req.body.gmail,url);
                return res.send("Email has been sent for verification");
              }).catch((err)=>{
             console.log(err);
              })

              }
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
              const text = String(new Date().getMilliseconds()) + req.body.gmail;
              const token = sha1(text);
              const url = `http://localhost:${process.env.PORT}/signup/admin/verify/${token}`;
              AdminTemp.findOne({gmail:req.body.gmail}).then((x)=>{
               if(x!==null){
                x.name = req.body.name;
                x.password = req.body.password;
                x.save().then((z)=>{
                  sendemailadmin(url);
                  return res.send("Email has been seen to higher authority for verification");

                })
                .catch((err)=>{console.log(err);})
               }
               else{
                let newadmin = new AdminTemp({name:req.body.name,gmail:req.body.gmail,password:req.body.password,token:token});
                newadmin.save().then((admin)=>{
                 sendemailadmin(url);
                 return res.send("Email has been seen to higher authority for verification");
                })
                .catch((err)=>{
                 console.log(err);
                })
               }
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
    console.log(resp);
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
});

module.exports = router;