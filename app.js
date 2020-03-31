const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const dotenv = require("./.gitignore/node_modules/dotenv/types");
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  var data = {
    members : [ 
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  
  var jsonData = JSON.stringify(data)
  const url = "https://us19.api.mailchimp.com/3.0/lists/861dbbd910";
  const options = {
    method: "POST",
    auth: process.env.APIKEY
  }

  const request = https.request(url , options , function(response){
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){

      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure.html",function(req,res){
  res.redirect("/");
})

 app.listen(process.env.PORT || 3000,function(){
   console.log("Listening on port 3000");
 })

//  e8ea0d625e16e868b51050334e794067-us19