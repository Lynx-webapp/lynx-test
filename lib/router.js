const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
// Accueil
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/home',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/acceuil',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

// Guidelines

router.get('/guidelines',function(req,res){
  res.sendFile(path.join(__dirname+'/guidelines.html'));
});

router.get('/charte',function(req,res){
  res.sendFile(path.join(__dirname+'/guidelines.html'));
});

// Register

router.get('/register',function(req,res){
  res.sendFile(path.join(__dirname+'/register.ejs'));
});

//add the router
app.use('/', router);

app.listen(process.env.PORT || 3000, (e)=> {
    if(e) throw e
    console.log(`[Serveur]: started successfully at localhost:${process.env.PORT || 3000}`)
})

require('./engine')(app, require('express'))
require('glob').sync('src/utils/**/*.js').forEach(a=> {
    //require(path.resolve(a))(app)
    //console.log(path.resolve(a))
})
