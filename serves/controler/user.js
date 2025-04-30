const User=require("../model/user");
const nodemailer=require("nodemailer");
const fs = require("fs");
const axios = require('axios');


async function handlePostRegister(req,res) {
    const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(`<script>alert("Email already exists! Please login."); window.location.href = "http://127.0.0.1:5500/public/login.html";</script>`);
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send(`<script>alert("User registered successfully!"); window.location.href = "http://127.0.0.1:5500/public/login.html";</script>`);
  } catch (err) {
    res.status(500).send("Error registering user.");
  }


}


async function handlePostLogin(req,res) {
    const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
          logLoginActivity(user.name, user.email);
          user.lastLogin = new Date();
          await user.save();
          res.send(`<script>window.location.href = "http://127.0.0.1:5500/public/NUTAN_Ai_main.HTML?name=${user.name}";</script>`);
        } else {
          res.send(`<script>alert("Invalid credentials!"); window.location.href = "/login";</script>`);
        }
      } catch (err) {
        res.status(500).send("Error logging in.");
      }
}



async function handlePostForgotPassword(req,res) {
    const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '_replace_your_own_Gmail_id',
        pass: '' // Replace with your real app password
      }
    });

    const mailOptions = {
      to: user.email,
      subject: 'Your Password',
      text: `Your password is: ${user.password}`
    };

    await transporter.sendMail(mailOptions);
    res.send('Password sent to email');
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send('Error sending email');
  }
}


async function handlePostgetHistory(req,res) {
    try {
        const { name } = req.body;
        const user = await User.findOne({ name });
        if (!user) return res.status(404).json({ error: "User not found" });
    
        res.json(user.searchHistory.reverse());
      } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to fetch history." });
      }
}


async function handlePostSaveHistory(req,res) {
    const { name, prompt } = req.body;
  try {
    await User.updateOne(
      { name },
      { $push: { searchHistory: { prompt } } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ success: false });
  }
}


// Log login activity to file
function logLoginActivity(name, email) {
  const timestamp = new Date().toLocaleString();
  const log = `User: ${name}, Email: ${email}, Logged in at: ${timestamp}\n`;
  fs.appendFile("login_activity.log", log, err => {
    if (err) console.error("Error writing log:", err);
  });
}

async function handlePostGenarateImage(req,res) {
    const { prompt } = req.body;
    const HF_API_KEY = "_Use_youR_Hugging_face_API_key";

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );

        res.set("Content-Type", "image/png");
        res.send(response.data); 

    } catch (error) {
        console.error("Hugging Face API error:", error?.response?.data || error.message);
        res.status(500).send("Failed to generate image from Hugging Face.");
    }
}


module.exports={
    handlePostForgotPassword,
    handlePostGenarateImage,
    handlePostRegister,
    handlePostLogin,
    handlePostSaveHistory,
    handlePostgetHistory,
  
};