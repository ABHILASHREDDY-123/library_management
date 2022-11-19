const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    publishedDate:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:String,
        require:true
    },
    refno:{
        type:String,
        require:true,
    },
    no_of_copies:{
        type:Number,
        default:0
    },
    status:{
        type:Boolean,
        default:true
    },
    photo:{
        data:Buffer,
        contentType:String
    }

});
module.exports = mongoose.model("Book",bookSchema);