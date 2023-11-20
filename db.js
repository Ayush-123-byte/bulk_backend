const mongoose = require('mongoose');
const URI= "mongodb+srv://ayush132:TsH23wA1V1xbBBzE@cluster0.ivszlkf.mongodb.net/whatsabulk"
const connectTOMongo=()=>{
    mongoose.connect(URI);
    console.log("connected to mongo db");
}
 
module.exports=connectTOMongo;