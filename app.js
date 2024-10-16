const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/contact",(req,res)=>{
    res.render("contact");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
});
app.get("/course",(req,res)=>{
    const userData = req.flash("userData");
    res.render("course", { userData: userData.length ? userData[0] : null });
});
app.post("/create", (req,res)=>{
    let {username,email,password,age} = req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        // console.log(salt);

        bcrypt.hash(password,salt,async(err,hash)=>{
            let userCreated =await userModel.create({
                username,
                email,
                password:hash,
                age,
            });
            let token = jwt.sign({email},"secret");
            res.cookie("token",token);
            req.flash("userData", userCreated);
            res.redirect("/course");
           
            // res.redirect("/course");
        })
    })
   
});

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login");
})
app.post("/login",async(req,res)=>{
    let user =await userModel.findOne({email:req.body.email});
    // console.log(user.password, req.body.password);
    if(!user) return res.send("Somthing went wrong!");
    
    bcrypt.compare(req.body.password, user.password, (err,result)=>{
        
        if(result) {
            
            let token = jwt.sign({email: user.email},"secret");
            res.cookie("token",token);
            res.redirect("/course");
        }else{
            res.status(500).send("Incorrect email or password!");
        }     
    });
});



app.listen(port,()=>{
    console.log("App listen on port",port);
    
})