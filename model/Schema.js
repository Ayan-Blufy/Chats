const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true ,min:4, trim:true},
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true, min: 4, trim: true },
        pic: {
            type: "String",
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },

        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        resetToken: {
            type: String
        },
        expiresIn:{
            type:String
        }
    },
    { timestaps: true }
);

// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);

    }
    next();

});
userSchema.methods.changepassword = async function (password) {

    try {

        console.log(password);
        this.password = await bcrypt.hash(password, 12);
        
        await this.save();
        return this.password;
    } catch (err) {
        console.log(err);
    }
}


userSchema.methods.createResetToken = async function () {

    try {

        // const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY,{expiresIn:120});
        const Token = crypto.randomBytes(32).toString("hex");
        this.resetToken = Token;
        this.expiresIn=Date.now()+180000;
        await this.save();
        return Token;
    } catch (err) {
        console.log(err);
    }
}
userSchema.methods.generateAuthToken = async function () {

    try {

        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}
userSchema.methods.delAuthToken = async function (token) {

    try {


        const arr = this.tokens.filter((ele, i) => ele.token != token);
        this.tokens = arr;
        await this.save();
        return arr;

    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;