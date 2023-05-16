const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    gmail:{
        type:String,
        require:true,
        unique:true
    },
    reg_no:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
     borrowed:[{book_id:{type:mongoose.Schema.Types.ObjectId,ref:"Book"},
     takendate:{type:Date,default:Date.now()}}],
    //  returned:[{book_id:{type:mongoose.Schema.Types.ObjectId,ref:"Book"},
    //  givendate:{type:Date,default:Date.now()}}],
     list:[{book_id:{type:mongoose.Schema.Types.ObjectId,ref:"Book"},
     takendate:{type:Date,
    default:Date.now()},
    givendate:{type:Date}}],
    fee:{
        type:Number,
        default:0
    },
    fine_paid:{
        type:Number,
        default:0
    }
});
module.exports = mongoose.model("User",UserSchema);

