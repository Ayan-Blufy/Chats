const nodemailer = require("nodemailer");

module.exports.sendMail=async function sendMail(str,data){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: "modakaryan10@gmail.com", 
            pass: "bkuiaxjytbyhtcrk", 
        },
    });

    let Osubject="",Otext="",Ohtml="";
    if(str=="signup")
    {
        Osubject=`Thank you for singing ${data.name}`;
        Ohtml=`
        <h1>Welcome to Swappy</h1>
        Hope you have a good time !<br>
        Please Confirm are your details-<br>
        Name - ${data.name}<br>
        Email - ${data.email}<br>
        
        `

    }
    else if(str=="resetpassword")
    {
        Osubject = `Reset Password`; 
        Ohtml = `
        <h1>Welcome to Swappy</h1>
        Hope you have a good time !<br>
        Here is your link to reset your password !<br>
        ${data.resetPasswordLink}
        
        `
    }
 
    let info = await transporter?.sendMail({
        from: '"Swappy Chat App 👻" <modakaryan10@gmail>', 
        to: data.email, 
        subject: Osubject,
        html:Ohtml, 
    });
    console.log("Message sent: %s", info?.messageId);
}


