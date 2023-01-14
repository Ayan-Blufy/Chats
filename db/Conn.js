const mongoose=require("mongoose");


mongoose.connect(process.env.MONGODB,{

    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connection is done");
}).catch((err) => {
    console.log(err);
})