const express = require("express");
const dotenv = require("dotenv");
const sha1 = require("sha1");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const ForgotSchema = require("../Schema/forgotSchema");
var nodemailer = require("nodemailer");
const router = express.Router();

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
router.post("/admin/new", (req,res)=>{
    if(req.body.gmail===undefined){return res.send({error:"Invalid  Credentials",err:1});}
         Admin.findOne({gmail:req.body.gmail}).then((resp)=>{
            if(resp===null){
                  res.send({error:"Invalid Credentials",err:1});
            }
            else{
              const text = String(new Date().getMilliseconds()) + req.body.gmail;
              const token = sha1(text);
              const url = `http://localhost:${process.env.REACT_PORT}/forgot/verify/${token}`;
              ForgotSchema.findOne({gmail:req.body.gmail,admin:1}).then((x)=>{
               if(x!==null){
                x.token = token;
                x.save().then((z)=>{
                  sendemail(req.body.email,url);
                  return res.send({data:"Email Sent for Verfication"});

                })
                .catch((err)=>{console.log(err);})
               }
               else{
                let newadmin = new ForgotSchema({gmail:req.body.gmail,token:token,admin:1});
                newadmin.save().then((admin)=>{
                 sendemail(req.body.gmail,url);
                 return res.send({data:"Email Verification sent"});
                })
                .catch((err)=>{
                 console.log(err);
                })
               }
              })
            }
           
         })
});
router.post("/user/new", (req,res)=>{
    console.log(req.body);
    if(req.body.gmail===undefined){return res.send({error:"Invalid  Credentials",err:1});}
         User.findOne({gmail:req.body.gmail}).then((resp)=>{
            if(resp===null){
                  res.send({error:"Invalid Credentials",err:1});
            }
            else{
              const text = String(new Date().getMilliseconds()) + req.body.gmail;
              const token = sha1(text);
              const url = `http://localhost:${process.env.REACT_PORT}/forgot/verify/${token}`;
              ForgotSchema.findOne({gmail:req.body.gmail,admin:0}).then((x)=>{
               if(x!==null){
                x.token = token;
                x.save().then((z)=>{
                  sendemail(req.body.gmail,url);
                  return res.send({data:"Email Sent for Verfication"});

                })
                .catch((err)=>{console.log(err);})
               }
               else{
                let newadmin = new ForgotSchema({gmail:req.body.gmail,token:token});
                newadmin.save().then((admin)=>{
                 sendemail(req.body.gmail,url);
                 return res.send({data:"Email Verification sent"});
                })
                .catch((err)=>{
                 console.log(err);
                })
               }
              })
            }
           
         })
})
router.post("/admin/:token",(req,res)=>{
       const token = req.params.token;
       ForgotSchema.findOne({token:token,admin:1})
       .then((resp)=>{
        if(resp==null){
        res.send({error:"Invalid Credentials",err:1});
        }
        else{
        Admin.findOne({gmail:resp.gmail}).then((rx)=>{
          rx.password=req.body.password;  
          rx.save().then((x)=>{
             
                ForgotSchema.deleteOne({token:token}).then((y)=>{
                res.send({data:"Password Changed Successfully"});
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        })
    }
       
       })
       .catch((err)=>{
        console.log(err);
       })
    
});

router.post("/user/:token",(req,res)=>{
    const token = req.params.token;
    ForgotSchema.findOne({token:token,admin:0})
    .then((resp)=>{
        if(resp===null){res.send({error:"Invalid Credentials",err:1});}
        else{
        User.findOne({gmail:resp.gmail}).then((rx)=>{
      rx.password=req.body.password;
     rx.save().then((x)=>{
        ForgotSchema.deleteOne({token:token})
        .then((y)=>{
         res.send({data:"Password Changed Successfully"});
        })
        .catch((err)=>{
            console.log(err);
        })
        })
     .catch((err)=>{
         console.log(err);
     })
    
    });
}
    })
    .catch((err)=>{
     console.log(err);
    })
});
module.exports = router;
