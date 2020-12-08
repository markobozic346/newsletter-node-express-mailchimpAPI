const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");



    

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// includes static files - CSS
app.use('/css',express.static(__dirname +'/css'));


app.get("/", (req, res) => {

res.sendFile(__dirname + "/signup.html")


});


app.post("/", (req, res) => {

    // data from input fields
    var fName = req.body.firstName;
    var sName = req.body.secondName;
    var email = req.body.email;

    // store data in format which is required from mailchimp
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: sName
            }

        }]
    };
    var jsonData = JSON.stringify(data);

    // mailchim api url with list id
    const url = "https://us7.api.mailchimp.com/3.0/lists/251b008bb0"

    // mailchimp options and API verification code
    const option = {
        method: "POST",
        auth: "marko1:48d51d57c5e75524d891bc47170ae703-us7"
    }

    const request = https.request(url, option, function(response){
        response.on("data", function(data){
         var responseData = JSON.parse(data);
        
         //redirect user on success/failure page depending on error count
         if(responseData.error_count === 0){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        });
       

    });

    
    request.write(jsonData)
    request.end();
});

// redirects user on home page when try again button is clicked
app.post("/failure", (req, res) => {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, () =>{
    console.log("Server is listening on port 3000");
})

// API 48d51d57c5e75524d891bc47170ae703-us7
// list id 251b008bb0