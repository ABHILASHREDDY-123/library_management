const mongoose = require("mongoose");
const AdminTempSchema = new mongoose.Schema({
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
    },
    token:{
        type:String,
        require:true
    }
});
module.exports  = mongoose.model("AdminTemp",AdminTempSchema);