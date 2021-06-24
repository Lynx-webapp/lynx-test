const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.ejs'));
  //__dirname : It will resolve to your project folder.
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
