const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");


// const registerSchema = Joi.object({
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//   });
  
//   const loginSchema = Joi.object({
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//   });

router.post("/register", async (req, res) => {
    // const { error } = registerSchema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
  
    //Check if the user is allready in the db
    const emailExists = await User.findOne({ email: req.body.email });
  
    if (emailExists) return res.status(400).send("Email allready exists");
  
    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const hashConfirmPassword= await bcrypt.hash(req.body.confirm_password,salt)
  
    //create new user
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email:req.body.email,
      password: req.body.password,
      confirm_password:req.body.confirm_password
    });
  
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (err) {
      res.send({"reason":"email already exists"})
      //res.status(400).send(err);
    }
  });


router.post("/login", async (req, res) => {
    // const { error } = loginSchema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
  
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).send({"reason":"User does not exist"});
  
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({"reason":"email or password is wrong"});
  
    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({"isLoggedIn":"YES","token":token});
  });
module.exports = router;