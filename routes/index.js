var express = require('express');
var router = express.Router();

const userModel=require("./users");
const passport =require('passport');
const localStrategy =require('passport-local').Strategy;

passport.use(new localStrategy(userModel.authenticate()));
const postModel=require("./posts");


router.get('/', function(req, res, next) {
  res.render('index');
});
//profile page -> create posts and show posts
router.get('/profile',isLoggedIn,function(req, res) {
  userModel.findOne({username: req.session.passport.user})
  .populate('posts')
  .then(function(data){
  res.render("profile",{data});
  // res.send(data)
})
});


//edit page -> edit user details and show updation form
router.get('/edit/:id',isLoggedIn,function(req,res){

userModel.findOne({_id:req.params.id})
.then(function(oldData){                                                                                                                                                                                                                                                                                                                                                       
  res.render('edit',{oldData:oldData});
})
})
//Edit Page - edit new details and Redirect back to profile page
router.post('/edit/:id',isLoggedIn,function(req,res){
  userModel.findOneAndUpdate({_id:req.params.id},{username: req.body.username,email:req.body.email},{new:true})
  .then(function(){
    res.redirect('/profile')
  })
}) 

//delete post
router.get('/delpost/:id',isLoggedIn,function(req,res){
  postModel.findOneAndDelete({_id:req.params.id})
  .then(function(deletedUser){
    res.redirect('/profile')
  })
})
//Register user
router.post('/reg', function(req, res) {
 var newUser =new userModel({
   name:req.body.name,
   username:req.body.username
 })
userModel.register(newUser, req.body.password) 
  .then(function(reguser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
  .catch(function(e){
    res.send(e);
  })
});
//login Page
router.post('/login', passport.authenticate('local',{
successRedirect : '/profile',
failureRedirect : '/'
}),
function(req,res){ });
//logout
router.get('/logout',function(req,res, next){
  req.logout();
  res.redirect('/');
});
//Profile Page -> To create posts
router.post("/post",isLoggedIn, function(req,res){
  postModel.create({
    post:req.body.newpost,
      username:req.session.passport.user
    })
  .then(function(postData){
    // res.redirect('/profile')
    userModel.findOne({username: req.session.passport.user})
    .then(function(userData){
      userData.posts.push(postData._id)
      userData.save().then(function(){
        res.redirect('/profile')
      })
    })// res.send(postData)
  })
})
//Profile Page ->like Posts
router.get("/like/:id", isLoggedIn ,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(foundUser){
    postModel.findOne({_id:req.params.id})
    .then(function(foundpost){
      //Range Like from 0 to 1 and remembers the use who liked
      if(foundpost.likes.indexOf(foundUser._id) === -1){
        foundpost.likes.push(foundUser._id)
      }else{
var kahaprexist =foundpost.likes.indexOf(foundUser._id);
foundpost.likes.splice(kahaprexist,1);
      }
      foundpost.save().then(function(){
        res.redirect("/profile");
      
    })
  })    
  })
})
//comments -> 
router.post('/comment/:postid',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(fu){
    postModel.findOne({_id: req.params.postid})
    // .populate('comments')
    .then(function(postData){
    postData.comments.push({comment : req.body.comment, userid: fu._id})
    postData.save()
    .then(function(){
      res.redirect('/profile')
    })
    })
  })
})

//feed page -> to show all user posts
router.get('/feed',isLoggedIn, function(req,res){
  postModel.find()
  .then(function(saarePosts){
    res.render('feed',{saarePosts})
    // res.send(saarePosts)
  })
})
//loggedin
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

module.exports = router;
