const mongoose = require('mongoose');

const postsSchema=mongoose.Schema({
  post:String,
  likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
  }],
  userid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
  },
  comments: [
    {
      userid: {type: mongoose.Schema.Types.ObjectId,
      ref:"user"},
      comment:{type:String}
    }
  ]
  
})


module.exports=mongoose.model("post",postsSchema);