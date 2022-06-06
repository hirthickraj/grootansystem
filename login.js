const mysql = require("mysql");
const express = require("express");
const { process_params } = require("express/lib/router");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();

app.use("/assets",express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password : "root",
    database : "hirthick"
});

connection.connect(function(error){
    if(error) throw error
    else console.log("Connected to the Database Successfully")
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/register",function(req,res){
    res.sendFile(__dirname + "/register.html");
});

app.post("/",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    connection.query("select * from user where email = ? and password = ?",[email,password],function(error,results,fields){
        if(results.length > 0 ) {
            res.redirect("/welcome");
            
        } else {
            res.redirect("/");
        }
        res.end();
    })
});

app.post("/register",encoder,function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var phonenumber = req.body.number;
    var password = req.body.password;
    connection.query("insert into user (name,email,phonenumber,password) values (?,?,?,?)",[name,email,phonenumber,password],function(err,results,fields){
        if(err) {
            res.redirect("/register")
            throw err;
            
        } else {
            res.redirect("/");
        }
        res.end();
    })
});

app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html")
});

app.listen(8000);