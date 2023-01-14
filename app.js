const dotenv=require("dotenv");
const express=require("express");
const app=express();
dotenv.config({path:'./config.env'});
const port=process.env.PORT;
const router=require("./routers/router");
const chatrouter=require("./routers/chatrouter");
const msgrouter=require("./routers/messagerouter");
const nodemailer = require("nodemailer");
const path = require("path");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use("/api/users",router);
app.use("/api/chats",chatrouter);
app.use("/api/messages",msgrouter);

require("./db/Conn");

const server=app.listen(port,()=>{
    console.log(`running successfully on port ${port}`);
})


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}



const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    // console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
   
    });
  

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});






