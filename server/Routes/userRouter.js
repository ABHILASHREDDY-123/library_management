const express = require("express");
const User = require("../Schema/userSchema");
const Book = require("../Schema/bookSchema");
const {requireSignIn} = require("../controllers/authorization");
const router = express.Router();
function Lcs(str1, str2) {
    var len1 = str1.length;
    var len2 = str2.length;
   
    var lcs = new Array(len1 + 1);
    for (var i = 0; i <= len1; i++) {
        lcs[i] = new Array(len2 + 1)
    }
    for (var i = 0; i <= len1; i++) {
        for (var j = 0; j <= len2; j++) {
            if (i == 0 || j == 0) {
                lcs[i][j] = 0;
            }
            else {
                if (str1[i - 1] == str2[j - 1]) {
                    lcs[i][j] = 1 + lcs[i - 1][j - 1];
                }
                else {
                    lcs[i][j] = Math.max(lcs[i][j - 1], lcs[i - 1][j]);
                }
            }
        }}
        var n = lcs[len1][len2];
        return n;
    }
router.get("/book",(req,res)=>{
    Book.find({}).then((resp)=>{
        res.send({resp});
    })
    .catch((err)=>{
        console.log(err);
    });
});
router.get("/book/search/:book_name",(req,res)=>{
    let book_name = req.params.book_name;
   Book.find({}).then((resp)=>{
    let sz  = resp.length;
    let books = resp;
    let sz1 = book_name.length;
    let bk =[];
    let z=0;
    for(let i=0;i<sz;i++){
           z = Lcs(books[i].name.toLowerCase(),book_name.toLowerCase());
        if(z*10 > sz1*7){bk.push(books[i]);}   
    }
    res.send({bk});

});
});
router.get("/book/:id",(req,res)=>{
let id  = req.params.id;
console.log(id);
Book.findOne({_id:id}).then((book)=>{
res.send({book});
})
.catch((err)=>{
console.log(err);
})
});
router.get("/book/borrowed/:reg_no",requireSignIn,(req,res)=>{
          let reg_no = req.params.reg_no;
         
          User.findOne({reg_no:reg_no}).then((resp)=>{
            if(resp._id.equals(req.user._id)){
          //  console.log(resp);
            res.send({taken_books:resp.borrowed});
            }
            else{
                res.send("You are not authorized");
            }
          })
          .catch((err)=>{
            console.log(err);
          })

});
router.get("/book/list/:reg_no",requireSignIn,(req,res)=>{
    let reg_no=req.params.reg_no;
    User.findOne({reg_no:reg_no}).then((resp)=>{
        res.send({list:resp.list});
    })
    .catch((err)=>{
        console.log(err);
    })
});
router.get("/book/fine/:reg_no",requireSignIn,(req,res)=>{
    let reg_no = req.params.reg_no;
    User.findOne({reg_no:reg_no}).then((resp)=>{
        let sz = resp.list.length;
        let fine =0;
        let time = 2629800000;
        for(let i=0;i<sz;i++){
              if((resp.list[i].givendate.getMilliseconds()-resp.list[i].takendate.getMilliseconds())>time){
                fine+=(Math.floor((resp.list[i].givendate-resp.list[i].takendate)/time)*10);
              }
        }
        res.send({fine:fine});
    }).catch((err)=>{
        console.log(err);
    });
});
router.get("/user/:reg_no",(req,res)=>{
    let reg_no = req.params.reg_no;
    User.findOne({reg_no:reg_no}).then((resp)=>{
        if(resp===null){
            return {err:"No user"};
        }
        resp.password=undefined;
        return res.send({resp});
    })
    .catch((err)=>{
        console.log(err);
    })
});
router.put("/update",requireSignIn,(req,res)=>{
          let reg_no = req.body.obj.reg_no;
           User.findOne({reg_no:reg_no})
           .then((resp)=>{
                 if(resp===null){
                    res.status(400).send("No User exists");
                 }
                 else if(!resp._id.equals(req.user._id)){
                    
                    res.send("You are not authorized");
                 }
                 else{
                    let {password,name} = req.body.obj ;
                    if(password!==undefined){resp.password = password;}
                    if(name!==undefined){resp.name = name;}
                    resp.save().then((x)=>{
                        x.password=undefined;
                        res.status(200).send({user:x});
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                 }
           })
})
module.exports = router;