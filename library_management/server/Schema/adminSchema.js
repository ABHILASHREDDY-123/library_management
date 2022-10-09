const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    gmail:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});
module.exports  = mongoose.model("Admin",AdminSchema);