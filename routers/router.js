const express = require("express");
const router = express.Router();
const chats = require("./chats");
const playlist = require("../model/Schema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authetication");
const nodemailer = require("nodemailer");
const { sendMail } = require("./Nodemailer");
const { findByIdAndUpdate } = require("../model/Schema");
const { response } = require("express");
const limit=require('../middleware/RateLimiter')
// send mail with defined transport object


router.get('/root', authenticate, async (req, res) => {


    return res.status(200).send(req?.rootUser);
});




router.post("/register",limit, async (req, res) => {
    const { name, email, password, confirmpassword, pic } = req.body;
    try {
        const ans = await playlist.findOne({ email });
        if (ans) {
            return res.status(402).send({ msg: "Email is already in use" });

        }
        else {
            if (password === confirmpassword) {
                const result = new playlist({ name: name, email: email, password: password, pic: pic });

                //phele
                await result.save();

                const user = await playlist.findOne({ email });
                sendMail("signup", user);
                return res.status(201).send({ msg: "User registration is done" });
            }
            else {
                res.status(402).send({ msg: "Invalid user credentials" });
            }

        }


    } catch (err) {
        console.log(err);
    }

})

router.post("/login",limit, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await playlist.findOne({ email });
        let token = "";
        if (user) {
            const ismatch = await bcrypt.compare(password, user?.password);
            if (ismatch) {

                token = await user.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                return res.status(201).send(user);
            }
            else {
                return res.status(404).send({ msg: "Invalid user credentials" });
            }
        }
        else {
            return res.status(404).send({ msg: "Invalid user credentials" });
        }


    } catch (err) {
        console.log(err);
    }

})

router.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await playlist.findOne({ email });
        const resetToken = await user.createResetToken();
       
        if (user) {
            let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
          
            let obj = {
                resetPasswordLink: resetPasswordLink,
                email: user.email

            }
            sendMail("resetpassword", obj);
            return res.status(201).send({ msg: "User Email Found" });
        }
        else {
            return res.status(402).send({ msg: "User Email Not Found" });
        }


    } catch (err) {
        console.log(err);
    }

})
router.post("/resetpassword/:resetToken", async (req, res) => {
    const { password, confirmpassword } = req.body;
    const token = req.params.resetToken;


    try {

        const user = await playlist.findOne({ resetToken: token });
        if (password === confirmpassword) {
            // const pass = await bcrypt.hash(password, 12);
            if (user.expiresIn) {
                if (user.expiresIn < Date.now()) {
                    return res.status(402).send({ msg: "Token Expired" });
                }


                user.password = password;
                await user.save();
                // const userdata = await playlist.updateOne({email:user.email }, { $set: { password: pass } });
            }
            return res.status(201).send(user);
        }
        else {
            return res.status(403).send({ msg: "Invalid credentials" });
        }





    } catch (err) {
        console.log(err);
    }

})

router.get("/", authenticate, async (req, res) => {

    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await playlist.find(keyword);
    const result = users.filter((ele, i) => {
        return ele._id != req.userID.toString();
    })

    return res.status(200).send(result);

})

router.post("/logout", async (req, res) => {
    try {

        const user = req.body.user;
        const ans = await playlist.findOne({ email: user.email });
        const jet = await ans.delAuthToken(req.cookies.jwt);
        res.clearCookie('jwt');
        return res.status(200).send('User logout');
    } catch (err) {
        console.log(err);
    }

})

module.exports = router;