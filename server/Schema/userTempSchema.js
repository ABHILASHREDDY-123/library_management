const mongoose = require("mongoose");
const UserTempSchema = new mongoose.Schema({
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
    token:{
        type:String,
        require:true
    }
});
module.exports = mongoose.model("UserTemp",UserTempSchema);