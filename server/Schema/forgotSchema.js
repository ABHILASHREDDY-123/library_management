const mongoose = require("mongoose");
const ForgotSchema = new mongoose.Schema({
    gmail:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true,
        unique:true
    },
    admin:{
        type:Boolean,
        default:0
    }
});
module.exports = mongoose.model("ForgotSchema",ForgotSchema);