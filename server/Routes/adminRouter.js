const express = require("express");
const Book = require("../Schema/bookSchema");
const User = require("../Schema/userSchema");
const jwt = require("jsonwebtoken");
const UserTemp = require("../Schema/userTempSchema");
const router = express.Router();
const Admin = require("../Schema/adminSchema");
const formidable = require("formidable");
const fs = require("fs");
function authenticate(req,res,next){
    
    const authHeader = req.headers['authorization'];
    if(authHeader===undefined){return res.send({error:"You are not authorized",err:1});}
    if(authHeader.split(' ').length<2){return res.send({error:"You are not authorized",err:1});}
    const token = authHeader.split(' ')[1]; 
    if(token===null){res.send({error:"You are not Authorized",err:1});}
    jwt.verify(token,process.env.JWT_KEY_ADMIN,(err,admin)=>{
        if(err){return res.send({error:"You are not Authorized",err:1});}
        req.admin = admin;
        next();
    })
}
router.get("/admin",authenticate,(req,res)=>{
    User.findById(req.user._id)
    .then((resp)=>{
        console.log(resp);
        return resp;
    })
    .catch((err)=>{
        console.log(err);
    })
})
router.get("/book",authenticate,(req, res) => {
    Book.find({}).then((resp) => {
        res.send({ resp });
    })
        .catch((err) => {
            console.log(err);
        });
});
router.get("/book/:refno",authenticate,(req, res) => {
    let refno = req.params.refno;
    Book.findOne({ refno: refno }).then((book) => {
        res.send({ book });
    })
        .catch((err) => {
            console.log(err);
        })
});
router.get("/book/borrowed/:reg_no",authenticate,(req, res) => {
    let reg_no = req.params.reg_no;
    User.findOne({ reg_no: reg_no }).then((resp) => {
        res.send({ taken_books: resp.borrowed });
    })
        .catch((err) => {
            console.log(err);
        })

});
router.get("/book/list/:reg_no",authenticate,(req, res) => {
    let reg_no = req.params.reg_no;
    User.findOne({ reg_no: reg_no }).then((resp) => {
        res.send({ list: resp.list });
    })
        .catch((err) => {
            console.log(err);
        })
});

router.get("/book/fine/:reg_no", authenticate,(req, res) => {
    let reg_no = req.params.reg_no;
    User.findOne({ reg_no: reg_no }).then((resp) => {
        let sz = resp.list.length;
        let fine = 0;
        let time = 2629800000;
        for (let i = 0; i < sz; i++) {
            if ((resp.list[i].givendate.getMilliseconds() - resp.list[i].takendate.getMilliseconds()) > time) {
                fine += (Math.floor((resp.list[i].givendate - resp.list[i].takendate) / time) * 10);
            }
        }
        res.send({ fine: fine });
    }).catch((err) => {
        console.log(err);
    });
});
router.post("/book",authenticate, (req, res) => {
            var form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req,(err,fields,files)=>{
                if(err){
                   return res.send({error:"Image Upload Failed",err:1});
                }
                else{
                    let book = new Book(fields);
                     Book.findOne({refno:book.refno})
                     .then((resp)=>{
                        if(resp===null){
                            if(files.photo){
                                book.photo.data = fs.readFileSync(files.photo.filepath);
                                book.photo.contentType = book.photo.mimetype;
                            }
                            
                            book.save((resp)=>{
                                res.send({data:"Successful"});
                            })
                            
                        }
                        else{
                            res.send({error:"Invalid refno",err:1});
                        }
                     })
                     .catch((err)=>{
                        console.log(err);
                     })
                   
                }
            })
    



});
router.put("/book/:refno",authenticate, (req, res) => {
    let refno = req.params.refno;
    Book.findOne({ refno: refno }).then((resp) => {
        if (resp === null) { res.send({error:"Invalid book reference number",err}); }
        else {
            if (req.body.name !== undefined) {
                resp.name = req.body.name;
            }
            if (req.body.author !== undefined) {
                resp.author = req.body.author;
            }
            if (req.body.publishedDate !== undefined) {
                resp.publishedDate = req.body.publishedDate;
            }
            if (req.body.no_of_copies !== undefined) {
                resp.no_of_copies = req.body.no_of_copies;
            }
            resp.save().then((x) => {
                res.send({ book: x });
            })
                .catch((err) => { console.log(err); })
        }
    })

});
router.put("/book/set_count/:refno/",authenticate, (req, res) => {
    let refno = req.params.refno;
    Book.findOne({ refno: refno }).then((resp) => {
        if (resp === null) { res.send({error:"Invalid reference number",err:1}); }
        else {
            Book.findByIdAndUpdate(resp.id, { no_of_copies: req.body.no_of_copies }, { new: true })
                .then((resp1) => {
                    res.send({ resp1 });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });

});

router.put("/take/:refno/:reg_no",authenticate, (req, res) => {
    let refno = req.params.refno;
    let reg_no = req.params.reg_no;
    Book.findOne({ refno: refno }).then((book) => {
        if (book === null) { res.send({error:"Invalid Reference number for book",err:1}); }
        else if (book.no_of_copies === 0) { res.send({error:"No copies are avaliable for this book",err:1}); }
        else {
            User.findOne({ reg_no: reg_no }).then((user) => {
                if (user === null) { res.send({error:"No such registration number present in ISM",err:1}); }
                else {
                    let date = Date.now();
                    user.borrowed.push({ book_id: { _id: book._id } });
                    // user.list.push({book_id:{_id:book._id}});
                    book.no_of_copies--;
                    if(book.no_of_copies===0){book.status=0;}
                    user.save().then((newuser) => {
                        book.save().then((book) => {
                            res.send({ user: newuser });
                        })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            });
        }
    });
});
router.put("/give/:refno/:reg_no",authenticate, (req, res) => {
    let refno = req.params.refno;
    let reg_no = req.params.reg_no;
    Book.findOne({ refno: refno }).then((book) => {
        if (book === null) { res.send({error:"Invalid Reference number for book",err:1}); }
        else {
            User.findOne({ reg_no: reg_no }).then((user) => {
                if (user === null) { res.send({error:"No such registration number present in ISM",err:1}); }

                else {
                    let flag = 0;
                    let id = 0;
                    for (let i = 0; i < user.borrowed.length; i++) {
                        if (user.borrowed[i].book_id.equals(book._id)) { flag = 1; id = i; }
                    }
                    if (flag == 0) { res.send({error:"Book hasn't taken by this user",err:1}); }
                    else {
                        let date = Date.now();
                        let item = user.borrowed[id];
                        user.borrowed.remove(item);
                        user.list.push({ book_id: item.book_id, takendate: item.takendate, givendate: date });
                        let sz = user.list.length;
                        let fine = 0;
                        let time = 2629800000;
                        for (let i = 0; i < sz; i++) {
                            if ((user.list[i].givendate.getMilliseconds() - user.list[i].takendate.getMilliseconds()) > time) {
                                fine += (Math.floor((user.list[i].givendate - user.list[i].takendate) / time) * 10);
                            }
                        }
                          user.fine = fine;
                        
                        book.no_of_copies++;
                        if(book.no_of_copies>0){book.status=1;}
                        user.save().then((newuser) => {
                            book.save().then((book) => {
                                res.send({ user: newuser });
                            })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                }
            });
        }
    });
});

router.delete("/book",authenticate, (req, res) => {
    Book.deleteMany({}).then((resp) => {
        res.send({data:"Deleted successfully"});
    })
        .catch((err) => {
            console.log(err);
        })
});
router.delete("/book/:refno",authenticate, (req, res) => {
    let refno = req.params.refno;
    Book.findOne({refno:refno}).then((resp) => {
        if(resp===null){
        res.send({error:"Book has been removed from website",err:1});
        }
        else{
            Book.deleteOne({refno:refno}).then((x)=>{
                res.send({data:"Deleted Successfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    })
        .catch((err) => {
            console.log(err);
        })
})

router.get("/user",authenticate, (req, res) => {
    User.find({}).then((users) => {
        res.send({ users });
    })
        .catch((err) => {
            console.log(err);
        });

});
router.get("/user/:reg_no",authenticate, (req, res) => {
    let reg_no = req.params.reg_no;
    User.findOne({ reg_no: reg_no }).then((user) => {
        res.send({ user });
    })
        .catch((err) => {
            console.log(err);
        });
});
router.delete("/user/",authenticate, (req, res) => {
    User.deleteMany({}).then((users) => {
        res.send("DELETED SUCCESSFULLY");
    })
        .catch((err) => {
            console.log(err);
        })
});
router.delete("/tempuser/",authenticate,(req,res)=>{
    UserTemp.deleteMany({}).then((resp)=>{res.send("Deleted Successfully");}).catch((err)=>{console.log(err);})
})
router.get("/tempuser/",authenticate,(req,res)=>{
    UserTemp.find({}).then((resp)=>{res.send({resp});})
    .catch((err)=>{console.log(err);})
});
router.delete("/admin",authenticate,(req,res)=>{
    Admin.deleteMany({}).then((resp)=>{return res.send("DELETED SUCCESSFULLY");})
    .catch((err)=>{console.log(err);})
  })
module.exports = router;