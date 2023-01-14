const jwt = require("jsonwebtoken");
const User = require("../model/Schema");


const Authenticate = async (req, res, next) => {

    try {

        const token = req.cookies.jwt;
        // console.log(token);

        const vaild = jwt.verify(token, process.env.SECRET_KEY);
       
        const rootUser = await User.findOne({ _id: vaild._id, "tokens.token": token});

        if (!rootUser) { throw new Error('User not Found') }

        req.token = token;
        req.rootUser = rootUser;
      
        req.userID = rootUser._id;
        
        next();


    } catch (err) {
        res.status(401).send('Unauthorized:No token provided');
        console.log(err);
    }



}







module.exports = Authenticate;
