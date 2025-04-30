const express = require("express");
const { handlePostForgotPassword,handlePostGenarateImage,handlePostRegister,handlePostLogin,handlePostSaveHistory,handlePostgetHistory}=require("../controler/user");
const path = require("path");


const Routes=express.Router();

    Routes.route("/generate-image").post(handlePostGenarateImage);
    Routes.route("/register").post(handlePostRegister);
    Routes.route("/login").post(handlePostLogin);
    Routes.route("/api/forgot-password").post(handlePostForgotPassword);
    Routes.route("/save-history").post(handlePostSaveHistory);
    Routes.route("/get-history").post(handlePostgetHistory);
    // Static Routes
    Routes.get("/", (req, res) => res.sendFile(path.join(__dirname, "../../view/index.html")));
    Routes.get("/login", (req, res) => res.sendFile(path.join(__dirname, "http://127.0.0.1:5500/view/login.html")));
    
    
module.exports=Routes;