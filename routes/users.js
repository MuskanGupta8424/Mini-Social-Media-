const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/sher");
var psl = require('passport-local-mongoose');

const userSchema=mongoose.Schema({
  username: String,
  password: String,
  name:String,
  posts:[
    {type: mongoose.Schema.Types.ObjectId ,ref : "post"}
  ]
});


userSchema.plugin(psl);


module.exports = mongoose.model("user",userSchema);
