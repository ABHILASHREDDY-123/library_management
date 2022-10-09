const express = require("express");
const Book = require("../Schema/bookSchema");
const User = require("../Schema/userSchema");
const jwt = require("jsonwebtoken");
const router = express.Router();
function authenticate(req,res,next){

    const authHeader = req.headers['authorization'];
    if(authHeader===undefined){return res.send("You are not authorized");}
    if(authHeader.split(' ').length<2){return res.send("You are not authorized");}
    const token = authHeader.split(' ')[1]; 
    if(token===null){res.send("You are not Authorized");}
    jwt.verify(token,process.env.JWT_KEY_ADMIN,(err,admin)=>{
        if(err){return res.send("You are not Authorized");}
        req.admin = admin;
        next();
    })
}
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
    Book.findOne({ refno: req.body.refno }).then((resp) => {
        if (resp !== null) { res.send("refno error occurred"); }
        else {
            let book = new Book(req.body);
            if(book.no_of_copies>0){book.status=1;}
            book.save().then((resp) => {
                res.send({ resp });
            })
                .catch((err) => {
                    console.log(err);
                });
        }

    });


});
router.put("/book/:refno",authenticate, (req, res) => {
    let refno = req.params.refno;
    Book.findOne({ refno: refno }).then((resp) => {
        if (resp === null) { res.send("Invalid book reference number"); }
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
    //console.log(refno);
    Book.findOne({ refno: refno }).then((resp) => {
        if (resp === null) { res.send("Invalid reference number"); }
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
        if (book === null) { res.send("Invalid Reference number for book"); }
        else if (book.no_of_copies === 0) { res.send("No copies are avaliable for this book"); }
        else {
            User.findOne({ reg_no: reg_no }).then((user) => {
                if (user === null) { res.send("No such registration number present in ISM"); }
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
        if (book === null) { res.send("Invalid Reference number for book or book might be removed from library"); }
        else {
            User.findOne({ reg_no: reg_no }).then((user) => {
                if (user === null) { res.send("No such registration number present in ISM"); }

                else {
                    let flag = 0;
                    let id = 0;
                    for (let i = 0; i < user.borrowed.length; i++) {
                        if (user.borrowed[i].book_id.equals(book._id)) { flag = 1; id = i; }
                    }
                    if (flag == 0) { res.send("Book hasn't taken by this user"); }
                    else {
                        let date = Date.now();
                        let item = user.borrowed[id];
                        // user.returned.push({book_id:{_id:book._id}});
                        user.borrowed.remove(item);
                        user.list.push({ book_id: item.book_id, takendate: item.takendate, givendate: date });
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
        res.send("Deleted successfully");
    })
        .catch((err) => {
            console.log(err);
        })
});
router.delete("/book/:refno",authenticate, (req, res) => {
    let refno = req.params.refno;
    Book.findOne({refno:refno}).then((resp) => {
        res.send("Book has been removed from website");
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

module.exports = router;